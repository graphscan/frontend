import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { Indexer, TotalAllocation } from './indexers.model';
import { HISTORY_APY_REQUEST_TIME_STORAGE_KEY } from '../../../../../../model/indexers.model';
import { useGraphNetwork } from '../../../../../../services/graph-network.service';
import {
  fetchAllConsecutively,
  fetchAllParallel,
  request,
  REQUEST_LIMIT,
} from '../../../../../../services/graphql.service';

const totalAllocationFragment = gql`
  fragment TotalAllocationFragment on Allocation {
    id
    indexingDelegatorRewards
    totalDelegatedTokensAtClose
    closedAt
  }
`;

const getHistoryApyPeriod = (plannedPeriod: string) => {
  const time =
    typeof window !== 'undefined'
      ? window.sessionStorage.getItem(HISTORY_APY_REQUEST_TIME_STORAGE_KEY)
      : null;

  return Math.floor((time ? Number(time) : Date.now()) / 1000) - Number(plannedPeriod) * 86400;
};

type IndexersResponse = {
  indexers: Array<Indexer>;
};

const createIndexersFetcher = (plannedPeriod: string) => async (skip: number) => {
  const { indexers } = await request<IndexersResponse>(
    gql`
      ${totalAllocationFragment}
      query {
        indexers(
          first: ${REQUEST_LIMIT},
          skip: ${skip}
        ) {
          id
          defaultDisplayName
          indexingRewardEffectiveCut
          indexingRewardCut
          queryFeeEffectiveCut
          queryFeeCut
          stakedTokens
          lockedTokens
          delegatedTokens
          allocatedTokens
          allocations(first: ${REQUEST_LIMIT}) {
            id
            allocatedTokens
            subgraphDeployment {
              id
              signalledTokens
              stakedTokens
              deniedAt
            }
          }
          totalAllocations(
            first: ${REQUEST_LIMIT}, 
            where:{ status_not: Active, closedAt_gte: ${getHistoryApyPeriod(plannedPeriod)} }
          ) {
            ...TotalAllocationFragment
          }
        }
      }
    `,
  );

  return indexers;
};

type TotalAllocationsResponse = {
  indexer: {
    id: string;
    totalAllocations: Array<TotalAllocation>;
  };
};

const createTotalAllocationsFetcher = ({
  indexerId,
  plannedPeriod,
}: {
  indexerId: string;
  plannedPeriod: string;
}) => async (skip: number) => {
  const {
    indexer: { totalAllocations },
  } = await request<TotalAllocationsResponse>(
    gql`
      ${totalAllocationFragment}
      query {
        indexer(id: ${JSON.stringify(indexerId)}) {
          id
          totalAllocations (
            first: ${REQUEST_LIMIT},
            skip: ${skip},
            where:{ status_not: Active, closedAt_gte: ${getHistoryApyPeriod(plannedPeriod)} }
          ) {
            ...TotalAllocationFragment
          }
        }
      }
    `,
  );

  return totalAllocations;
};

export const useIndexers = (plannedPeriod: string) => {
  const { data: networkData } = useGraphNetwork();

  return useQuery(
    ['indexers', plannedPeriod],
    async () => {
      if (!networkData) {
        return Promise.reject(new Error('Indexers request cannot be sent without network data.'));
      }

      const indexers = await fetchAllParallel(
        networkData.indexerCount,
        createIndexersFetcher(plannedPeriod),
      ).then((indexers) => {
        const indexersWithIncompleteAllocationsPool = indexers.filter(
          (i) => i.totalAllocations.length === REQUEST_LIMIT,
        );

        return indexersWithIncompleteAllocationsPool.length > 0
          ? Promise.all(
              indexersWithIncompleteAllocationsPool.map(async (i) => {
                const totalAllocations = await fetchAllConsecutively(
                  createTotalAllocationsFetcher({ indexerId: i.id, plannedPeriod }),
                  i.totalAllocations,
                );

                return { [i.id]: totalAllocations };
              }),
            ).then((response) => {
              const totalAllocationsPool = response.reduce(
                (acc, val) => ({
                  ...acc,
                  ...val,
                }),
                {},
              );

              return indexers.map((i) =>
                i.id in totalAllocationsPool ? { ...i, totalAllocations: totalAllocationsPool[i.id] } : i,
              );
            })
          : indexers;
      });

      return {
        indexers,
        networkData,
      };
    },
    { enabled: Boolean(networkData), keepPreviousData: true },
  );
};
