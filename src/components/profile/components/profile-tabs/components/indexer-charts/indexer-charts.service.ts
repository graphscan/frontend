import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import {
  RewardCutsItem,
  DelegationPoolItem,
  TotalAllocatedByNetworksItem,
  transformDelegationPoolToChartData,
  transformRewardCutsToChartData,
  transformTotalAllocatedByNetworksToPieData,
} from "./indexer-charts.model";
import {
  fetchAllConsecutively,
  fetchAllParallel,
  request,
  requestAnalytics,
  REQUEST_LIMIT,
} from "../../../../../../services/graphql.service";
import { useDebounce } from "../../../../../../utils/debounce.utils";

type ChartDataParams = {
  id: string;
  period: [from: number, to: number];
};

type ChartDataQueryParams = ChartDataParams & { enabled: boolean };

type IndexerDailyDataResponse = {
  indexerDailyDatas: Array<DelegationPoolItem>;
};

const createDelegationPoolFetcher =
  ({ id, period }: ChartDataParams) =>
  async (skip: number) => {
    const { indexerDailyDatas } =
      await requestAnalytics<IndexerDailyDataResponse>(
        gql`
      query {
        indexerDailyDatas(
          first: ${REQUEST_LIMIT},
          skip: ${skip}
          orderBy: dayNumber,
          where: {
            indexer: ${JSON.stringify(id.toLowerCase())},
            dayStart_gte: ${period[0]},
            dayStart_lte: ${period[1]}
          }
        ) {
          id
          dayStart
          dayNumber
          stakedTokens
          delegatedTokens
        }
      }
    `,
      );

    return indexerDailyDatas;
  };

export const useDelegationPool = ({
  id,
  period,
  enabled,
}: ChartDataQueryParams) => {
  const debouncedPeriod = useDebounce(period, 500);

  return useQuery(
    ["delegation-pool", id, debouncedPeriod],
    async () => {
      const pool = await fetchAllConsecutively(
        createDelegationPoolFetcher({ id, period: debouncedPeriod }),
      );

      return transformDelegationPoolToChartData(pool);
    },
    { enabled, keepPreviousData: true },
  );
};

type IndexerRewardCutsResponse = {
  indexerDailyDatas: Array<RewardCutsItem>;
};

const createRewardCutsFetcher =
  ({ id, period }: ChartDataParams) =>
  async (skip: number) => {
    const { indexerDailyDatas } =
      await requestAnalytics<IndexerRewardCutsResponse>(
        gql`
      query {
        indexerDailyDatas(
          first: ${REQUEST_LIMIT},
          skip: ${skip}
          orderBy: dayNumber,
          where: {
            indexer: ${JSON.stringify(id.toLowerCase())},
            dayStart_gte: ${period[0]},
            dayStart_lte: ${period[1]}
          }
        ) {
          id
          dayStart
          dayNumber
          indexingRewardCut
          queryFeeCut
          ownStakeRatio
          delegatedTokens
        }
      }
    `,
      );

    return indexerDailyDatas;
  };

export const useRewardCuts = ({
  id,
  period,
  enabled,
}: ChartDataQueryParams) => {
  const debouncedPeriod = useDebounce(period, 500);

  return useQuery(
    ["reward-cuts", id, debouncedPeriod],
    async () => {
      const rewardCuts = await fetchAllConsecutively(
        createRewardCutsFetcher({ id, period: debouncedPeriod }),
      );
      return transformRewardCutsToChartData(rewardCuts);
    },
    { enabled, keepPreviousData: true },
  );
};

const createIndexerAllocationsFetcher =
  (id: string) => async (skip: number) => {
    const { allocations } = await request<{
      allocations: Array<TotalAllocatedByNetworksItem>;
    }>(gql`
    query {
      allocations(
        first: ${REQUEST_LIMIT}
        skip: ${skip}
        where: { 
          indexer: ${JSON.stringify(id.toLowerCase())}
          status: "Active"
        }
      ) {
        id
        allocatedTokens
        subgraphDeployment {
          id
          manifest {
            network
          }
        }
      }
    }
  `);

    return allocations;
  };

export const useTotalAllocatedByNetworks = ({
  id,
  enabled,
}: Omit<ChartDataQueryParams, "period">) => {
  return useQuery(
    ["total-allocated-by-networks", id],
    async () => {
      const {
        indexer: { allocationCount },
      } = await request<{
        indexer: {
          id: string;
          allocationCount: number;
        };
      }>(
        gql`
          query {
            indexer(id: ${JSON.stringify(id.toLowerCase())}) {
              id
              allocationCount
            }
          }
        `,
      );

      const allocations = await fetchAllParallel(
        allocationCount,
        createIndexerAllocationsFetcher(id),
      );

      return transformTotalAllocatedByNetworksToPieData(allocations);
    },
    { enabled },
  );
};
