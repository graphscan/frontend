import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { compose, map } from 'ramda';
import {
  IndexerDelegator,
  IndexerDelegatorsRow,
  transformToRow,
  transformToCsvRow,
} from './indexer-delegators.model';
import { SortParams } from '../../../../../../model/sort.model';
import { INDEXER_DELEGATORS_CACHE_KEY } from '../../../../../../services/indexer-delegators.service';
import { fetchAllParallel, request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';
import { downloadCsv } from '../../../../../../utils/csv.utils';
import { sortRows } from '../../../../../../utils/table.utils';

type IndexerDelegatorsParams = {
  id: string;
  currentPage: number;
  perPage: number;
  sortParams: SortParams<IndexerDelegatorsRow>;
};

const indexerDelegatorFragment = gql`
  fragment IndexerDelegatorFragment on DelegatedStake {
    id
    delegatorId
    currentDelegationAmount
    stakedTokens
    unstakedTokens
    totalRewards
    realizedRewards
    unreleasedReward
    unreleasedRewardsPercent
    createdAt
    lastUndelegatedAt
  }
`;

type IndexerDelegatorsResponse = {
  delegatedStakes: Array<IndexerDelegator>;
};

export const useIndexerDelegators = ({ id, currentPage, perPage, sortParams }: IndexerDelegatorsParams) =>
  useQuery(
    [INDEXER_DELEGATORS_CACHE_KEY, id.toLowerCase(), currentPage, perPage, sortParams],
    async () => {
      const { delegatedStakes } = await request<IndexerDelegatorsResponse>(
        gql`
          ${indexerDelegatorFragment}
          query {
            delegatedStakes(
              first: ${perPage}
              skip: ${perPage * (currentPage - 1)}
              orderBy: ${sortParams.orderBy}
              orderDirection: ${sortParams.orderDirection}
              where: ${
                sortParams.orderBy === 'lastUndelegatedAt'
                  ? `{indexer: ${JSON.stringify(id.toLowerCase())} lastUndelegatedAt_not: null }`
                  : `{indexer: ${JSON.stringify(id.toLowerCase())} }`
              }
            ) {
              ...IndexerDelegatorFragment
            }
          }
        `,
      );

      return delegatedStakes.map(transformToRow);
    },
    { keepPreviousData: true },
  );

const createIndexerDelegatorsFetcher = (id: string) => async (skip: number) => {
  const { delegatedStakes } = await request<IndexerDelegatorsResponse>(
    gql`
      ${indexerDelegatorFragment}
      query {
        delegatedStakes(
          first: ${REQUEST_LIMIT}
          skip: ${skip}
          where: { indexer: ${JSON.stringify(id.toLowerCase())}}
        ) {
          ...IndexerDelegatorFragment
        }
      }
    `,
  );

  return delegatedStakes;
};

type IndexerDelegatorsCountResponse = {
  indexer: {
    id: string;
    delegatorsCount: number;
  };
};

export const useIndexerDelegatorsCount = (id: string) => {
  return useQuery(['indexer-delegators-count', id], async () => {
    const response = await request<IndexerDelegatorsCountResponse>(
      gql`
        query {
          indexer(id: ${JSON.stringify(id.toLowerCase())}) {
            id
            delegatorsCount
          }
        }
      `,
    );

    return response.indexer.delegatorsCount;
  });
};

const download = (data: Array<IndexerDelegator>, sortParams: SortParams<IndexerDelegatorsRow>) =>
  downloadCsv(
    compose(map(transformToCsvRow), sortRows(sortParams), map(transformToRow))(data),
    'indexer-delegators',
  );

export const useIndexerDelegatorsCsv = (id: string, sortParams: SortParams<IndexerDelegatorsRow>) => {
  const { data: delegatorsCount } = useIndexerDelegatorsCount(id);

  const { data, isFetching, refetch } = useQuery(
    ['all-indexer-delegators', id],
    async () => {
      if (!delegatorsCount) {
        return Promise.reject(
          new Error('Indexer Delegators request cannot be sent without delegators count.'),
        );
      }

      const delegators = await fetchAllParallel(delegatorsCount, createIndexerDelegatorsFetcher(id));

      return delegators;
    },
    { enabled: false },
  );

  const handleCsvDownload = useCallback(() => {
    data
      ? download(data, sortParams)
      : refetch().then((res) => (res.data ? download(res.data, sortParams) : res));
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
