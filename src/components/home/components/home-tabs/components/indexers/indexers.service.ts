import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import {
  Indexer,
  IndexerRaw,
  PLANNED_PERIOD_DAYS,
  TotalAllocationsResponse,
  getHistoricApyPeriod,
  mapDelegatedTokensToAllocations,
} from "./indexers.model";
import {
  fetchAllConsecutively,
  fetchAllParallel,
  request,
  requestAnalytics,
  REQUEST_LIMIT,
} from "../../../../../../services/graphql.service";
import { useNetworkStats } from "../../../../../../services/network-stats.service";
import { useRewardParameters } from "../../../../../../services/reward-parameters.service";
import {
  capacityProvisionFragment,
  fetchCapacityProvisions,
} from "../../../../../../services/indexer-capacity.service";
import {
  CURRENT_DATA_QUERY_OPTIONS,
  HISTORY_QUERY_OPTIONS,
} from "../../../../../../services/query-policy";

type CurrentIndexer = Omit<IndexerRaw, "dailyData" | "totalAllocations">;
type IndexerHistory = Pick<IndexerRaw, "id" | "dailyData" | "totalAllocations">;

export const currentAllocationFragment = gql`
  fragment CurrentAllocationFragment on Allocation {
    id
    allocatedTokens
    provision {
      id
      indexingRewardsCut
    }
    subgraphDeployment {
      id
      signalledTokens
      stakedTokens
      deniedAt
    }
  }
`;
export const totalAllocationFragment = gql`
  fragment TotalAllocationFragment on Allocation {
    id
    indexingDelegatorRewards
    closedAt
  }
`;

const fetchCurrentIndexers = async (skip: number) => {
  const { indexers, _meta } = await request<{
    indexers: CurrentIndexer[];
    _meta: { block: { number: number } };
  }>(gql`
    ${currentAllocationFragment}
    ${capacityProvisionFragment}
    query {
      _meta { block { number } }
      indexers(first: ${REQUEST_LIMIT}, skip: ${skip}, orderBy: id, orderDirection: asc) {
        id idOnL2 defaultDisplayName indexingRewardCut legacyIndexingRewardCut
        queryFeeCut ownStakeRatio stakedTokens lockedTokens delegatedTokens delegatedThawingTokens allocatedTokens
        provisions(first: ${REQUEST_LIMIT}, orderBy: id, orderDirection: asc) {
          ...CapacityProvisionFragment
        }
        allocations(first: ${REQUEST_LIMIT}, orderBy: id, orderDirection: asc, where: { allocatedTokens_not: "0" }) {
          ...CurrentAllocationFragment
        }
      }
    }
  `);
  const blockNumber = _meta.block.number;
  return Promise.all(
    indexers.map(async (indexer) => {
      indexer = {
        ...indexer,
        provisions: await fetchCapacityProvisions(
          indexer.id,
          indexer.provisions,
          blockNumber,
        ),
      };
      if (indexer.allocations.length < REQUEST_LIMIT) return indexer;
      const allocations = await fetchAllConsecutively(async (skip) => {
        const response = await request<{
          indexer: Pick<CurrentIndexer, "allocations">;
        }>(gql`
        ${currentAllocationFragment}
        query {
            indexer(id: ${JSON.stringify(indexer.id)}, block: { number: ${blockNumber} }) {
            allocations(first: ${REQUEST_LIMIT}, skip: ${skip}, orderBy: id, orderDirection: asc, where: { allocatedTokens_not: "0" }) {
              ...CurrentAllocationFragment
            }
          }
        }
      `);
        return response.indexer.allocations;
      }, indexer.allocations);
      return { ...indexer, allocations };
    }),
  );
};

const fetchIndexerHistory = async (skip: number) => {
  const { indexers } = await requestAnalytics<{
    indexers: IndexerHistory[];
  }>(gql`
    ${totalAllocationFragment}
    query {
      indexers(first: ${REQUEST_LIMIT}, skip: ${skip}, orderBy: id, orderDirection: asc) {
        id
        totalAllocations(first: ${REQUEST_LIMIT}, orderBy: id, orderDirection: asc, where: { status_not: Active, closedAt_gte: ${getHistoricApyPeriod(PLANNED_PERIOD_DAYS)} }) {
          ...TotalAllocationFragment
        }
        dailyData(first: ${PLANNED_PERIOD_DAYS}, orderBy: dayNumber, orderDirection: desc, where: { dayStart_gte: ${getHistoricApyPeriod(PLANNED_PERIOD_DAYS)} }) {
          dayNumber dayStart delegatedTokens
        }
      }
    }
  `);
  return Promise.all(
    indexers.map(async (indexer) => {
      const totalAllocations =
        indexer.totalAllocations.length < REQUEST_LIMIT
          ? indexer.totalAllocations
          : await fetchAllConsecutively(async (skip) => {
              const response =
                await requestAnalytics<TotalAllocationsResponse>(gql`
            ${totalAllocationFragment}
            query {
              indexer(id: ${JSON.stringify(indexer.id)}) {
                id
                totalAllocations(first: ${REQUEST_LIMIT}, skip: ${skip}, orderBy: id, orderDirection: asc, where: { status_not: Active, closedAt_gte: ${getHistoricApyPeriod(PLANNED_PERIOD_DAYS)} }) {
                  ...TotalAllocationFragment
                }
              }
            }
          `);
              return response.indexer.totalAllocations;
            }, indexer.totalAllocations);
      return {
        id: indexer.id,
        totalAllocations: mapDelegatedTokensToAllocations(
          totalAllocations,
          indexer.dailyData,
        ),
      };
    }),
  );
};

export const useIndexers = () => {
  const network = useNetworkStats();
  const rewards = useRewardParameters(network.data);
  const current = useQuery(
    ["indexers-current", network.data?.indexerCount],
    () => fetchAllParallel(network.data!.indexerCount, fetchCurrentIndexers),
    {
      ...CURRENT_DATA_QUERY_OPTIONS,
      enabled: Boolean(network.data),
      keepPreviousData: true,
    },
  );
  const history = useQuery(
    ["indexers-history", network.data?.indexerCount],
    () => fetchAllParallel(network.data!.indexerCount, fetchIndexerHistory),
    {
      ...HISTORY_QUERY_OPTIONS,
      enabled: Boolean(network.data),
      keepPreviousData: true,
    },
  );
  // Derive from live inputs instead of caching a closed-over network snapshot.
  const data = useMemo(() => {
    if (!network.data || !current.data || !history.data) return undefined;
    const histories = new Map(
      history.data.map((indexer) => [indexer.id, indexer.totalAllocations]),
    );
    return {
      indexers: current.data.map(
        (indexer): Indexer => ({
          ...indexer,
          totalAllocations: histories.get(indexer.id) ?? [],
        }),
      ),
      networkStats: network.data,
      rewardParameters: rewards.error ? null : (rewards.data ?? null),
    };
  }, [network.data, current.data, history.data, rewards.data, rewards.error]);
  const error = network.error || current.error || history.error;
  return {
    data,
    error,
    isLoading:
      !error && (network.isLoading || current.isLoading || history.isLoading),
    isRefetching:
      network.isRefetching || current.isRefetching || history.isRefetching,
  };
};
