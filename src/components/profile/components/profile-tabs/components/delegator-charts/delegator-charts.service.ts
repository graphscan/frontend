import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { DelegatorReward, transformToChartData } from './delegator-charts.model';
import { fetchAllConsecutively, request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';
import { useDebounce } from '../../../../../../utils/debounce.utils';

type DelegatorRewarsQueryParams = {
  id: string;
  period: [from: number, to: number];
};

type DelegatorRewardsResponse = {
  delegatorRewardHistoryEntities: Array<DelegatorReward>;
};

const createDelegatorRewardsFetcher = ({ id, period }: DelegatorRewarsQueryParams) => async (
  skip: number,
) => {
  const { delegatorRewardHistoryEntities } = await request<DelegatorRewardsResponse>(gql`
    query {
      delegatorRewardHistoryEntities(
        first: ${REQUEST_LIMIT},
        orderBy: blockNumber,
        skip: ${skip}
        where: {
          delegator: ${JSON.stringify(id.toLowerCase())},
          timestamp_gte: ${period[0]},
          timestamp_lte: ${period[1]}
        }
      ) {
        id
        reward
        timestamp
        epoch
        blockNumber
        indexer {
          id
        }
      }
    }
  `);

  return delegatorRewardHistoryEntities;
};

export const useDelegatorRewards = ({ id, period }: DelegatorRewarsQueryParams) => {
  const debouncedPeriod = useDebounce(period, 500);

  return useQuery(
    ['delegator-rewards', id, debouncedPeriod],
    async () => {
      const delegatorRewards = await fetchAllConsecutively(
        createDelegatorRewardsFetcher({ id, period: debouncedPeriod }),
      );

      return transformToChartData(delegatorRewards);
    },
    { keepPreviousData: true },
  );
};
