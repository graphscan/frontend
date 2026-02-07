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
  requestAnalytics,
  REQUEST_LIMIT,
} from "../../../../../../services/graphql.service";
import { useNetworkStats } from "../../../../../../services/network-stats.service";

export const totalAllocationFragment = gql`
  fragment TotalAllocationFragment on Allocation {
    id
    indexingDelegatorRewards
    closedAt
  }
`;

type IndexersResponse = {
  indexers: Array<IndexerRaw>;
};

const createIndexersFetcher = () => async (skip: number) => {
  const { indexers } = await requestAnalytics<IndexersResponse>(
    gql`
      ${totalAllocationFragment}
      query {
        indexers(
          first: ${REQUEST_LIMIT},
          skip: ${skip}
        ) {
          id
          idOnL2
          defaultDisplayName
          indexingRewardCut
          queryFeeCut
          ownStakeRatio
          stakedTokens
          lockedTokens
          delegatedTokens
          allocatedTokens
          allocations(
            first: ${REQUEST_LIMIT},
            where: { allocatedTokens_not: "0" }
          ) {
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
            where: { status_not: Active, closedAt_gte: ${getHistoricApyPeriod(PLANNED_PERIOD_DAYS)} }
          ) {
            ...TotalAllocationFragment
          }
          dailyData(
            first: ${PLANNED_PERIOD_DAYS},
            orderBy: dayNumber,
            orderDirection: desc,
            where: { dayStart_gte: ${getHistoricApyPeriod(PLANNED_PERIOD_DAYS)} }
          ) {
            dayNumber
            dayStart
            delegatedTokens
          }
        }
      }
    `,
  );

  return indexers;
};

const createTotalAllocationsFetcher =
  (indexerId: string, dailyData: IndexerRaw["dailyData"]) =>
  async (skip: number) => {
    const {
      indexer: { totalAllocations },
    } = await requestAnalytics<TotalAllocationsResponse>(
      gql`
      ${totalAllocationFragment}
      query {
        indexer(id: ${JSON.stringify(indexerId)}) {
          id
          totalAllocations (
            first: ${REQUEST_LIMIT},
            skip: ${skip},
            where:{ status_not: Active, closedAt_gte: ${getHistoricApyPeriod(PLANNED_PERIOD_DAYS)} }
          ) {
            ...TotalAllocationFragment
          }
        }
      }
    `,
    );

    return mapDelegatedTokensToAllocations(totalAllocations, dailyData);
  };

export const useIndexers = () => {
  const { data: networkStats } = useNetworkStats();

  return useQuery(
    ["indexers"],
    async () => {
      if (!networkStats) {
        return Promise.reject(
          new Error("Indexers request cannot be sent without network stats."),
        );
      }

      const indexers = await fetchAllParallel(
        networkStats.indexerCount,
        createIndexersFetcher(),
      ).then((rawIndexers) => {
        const indexersWithIncompleteAllocationsPool = rawIndexers.filter(
          (i) => i.totalAllocations.length === REQUEST_LIMIT,
        );

        if (indexersWithIncompleteAllocationsPool.length > 0) {
          return Promise.all(
            indexersWithIncompleteAllocationsPool.map(async (i) => {
              const totalAllocations = await fetchAllConsecutively(
                createTotalAllocationsFetcher(i.id, i.dailyData),
                mapDelegatedTokensToAllocations(
                  i.totalAllocations,
                  i.dailyData,
                ),
              );

              return { [i.id]: totalAllocations };
            }),
          ).then((response) => {
            const totalAllocationsPool = response.reduce<
              Record<string, Indexer["totalAllocations"]>
            >(
              (acc, val) => ({
                ...acc,
                ...val,
              }),
              {},
            );

            return rawIndexers.map((i): Indexer => {
              const { dailyData, totalAllocations, ...rest } = i;

              return {
                ...rest,
                totalAllocations:
                  i.id in totalAllocationsPool
                    ? totalAllocationsPool[i.id]
                    : mapDelegatedTokensToAllocations(
                        totalAllocations,
                        dailyData,
                      ),
              };
            });
          });
        }

        // Map delegatedTokens for all indexers
        return rawIndexers.map((i): Indexer => {
          const { dailyData, totalAllocations, ...rest } = i;

          return {
            ...rest,
            totalAllocations: mapDelegatedTokensToAllocations(
              totalAllocations,
              dailyData,
            ),
          };
        });
      });

      return {
        indexers,
        networkStats,
      };
    },
    { enabled: Boolean(networkStats), keepPreviousData: true },
  );
};
