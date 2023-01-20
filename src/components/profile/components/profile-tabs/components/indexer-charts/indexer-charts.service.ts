import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import {
  RewardCutsItem,
  DelegationPoolItem,
  transformDelegationPoolToChartData,
  transformRewardCutsToChartData,
} from './indexer-charts.model';
import { fetchAllConsecutively, request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';
import { useDebounce } from '../../../../../../utils/debounce.utils';

type ChartDataParams = {
  id: string;
  period: [from: number, to: number];
};

type ChartDataQueryParams = ChartDataParams & { enabled: boolean };

type DelegationPoolResponse = {
  delegationPoolHistoryEntities: Array<DelegationPoolItem>;
};

const createDelegationPoolFetcher = ({ id, period }: ChartDataParams) => async (skip: number) => {
  const { delegationPoolHistoryEntities } = await request<DelegationPoolResponse>(
    gql`
      query {
        delegationPoolHistoryEntities(
          first: ${REQUEST_LIMIT},
          skip: ${skip}
          orderBy: blockNumber,
          where: {
            indexer: ${JSON.stringify(id.toLowerCase())},
            timestamp_gte: ${period[0]},
            timestamp_lte: ${period[1]}
          }
        ) {
          id
          blockNumber
          delegatedTokens
          epoch
          stakedTokens
          timestamp
        }
      }
    `,
  );

  return delegationPoolHistoryEntities;
};

export const useDelegationPool = ({ id, period, enabled }: ChartDataQueryParams) => {
  const debouncedPeriod = useDebounce(period, 500);

  return useQuery(
    ['delegation-pool', id, debouncedPeriod],
    async () => {
      const pool = await fetchAllConsecutively(createDelegationPoolFetcher({ id, period: debouncedPeriod }));

      return transformDelegationPoolToChartData(pool);
    },
    { enabled, keepPreviousData: true },
  );
};

type IndexerRewardCutsResponse = {
  rewardCutHistoryEntities: Array<RewardCutsItem>;
};

const createRewardCutsFetcher = ({ id, period }: ChartDataParams) => async (skip: number) => {
  const { rewardCutHistoryEntities } = await request<IndexerRewardCutsResponse>(
    gql`
      query {
        rewardCutHistoryEntities(
          first: ${REQUEST_LIMIT},
          skip: ${skip}
          orderBy: blockNumber,
          where: {
            indexer: ${JSON.stringify(id.toLowerCase())},
            timestamp_gte: ${period[0]},
            timestamp_lte: ${period[1]}
          }
        ) {
          id
          queryFeeCut
          queryFeeEffectiveCut
          indexingRewardCut
          indexingRewardEffectiveCut
          timestamp
          epoch
          blockNumber
        }
      }
    `,
  );

  return rewardCutHistoryEntities;
};

export const useRewardCuts = ({ id, period, enabled }: ChartDataQueryParams) => {
  const debouncedPeriod = useDebounce(period, 500);

  return useQuery(
    ['reward-cuts', id, debouncedPeriod],
    async () => {
      const rewardCuts = await fetchAllConsecutively(
        createRewardCutsFetcher({ id, period: debouncedPeriod }),
      );
      return transformRewardCutsToChartData(rewardCuts);
    },
    { enabled, keepPreviousData: true },
  );
};
