import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { compose, map } from 'ramda';
import { Delegator, DelegatorsRow, transformToRow, transformToCsvRow } from './delegators.model';
import { SortParams } from '../../../../../../model/sort.model';
import { useGraphNetwork } from '../../../../../../services/graph-network.service';
import { fetchAllParallel, request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';
import { isTermLongEnough } from '../../../../../../utils/account-search.utils';
import { downloadCsv } from '../../../../../../utils/csv.utils';
import { sortRows } from '../../../../../../utils/table.utils';

type DelegatorsParams = {
  currentPage: number;
  perPage: number;
  sortParams: SortParams<DelegatorsRow>;
  idFilters: Array<string> | null;
};

const delegatorFragment = gql`
  fragment DelegatorFragment on Delegator {
    id
    currentStaked
    totalStakedTokens
    totalUnstakedTokens
    activeStakesCount
    totalRealizedRewards
    unreleasedReward
    lastDelegatedAt
    lastUndelegatedAt
  }
`;

type DelegatorsResponse = {
  delegators: Array<Delegator>;
};

export const useDelegators = ({ currentPage, perPage, sortParams, idFilters }: DelegatorsParams) =>
  useQuery(
    ['delegators', currentPage, perPage, sortParams, idFilters],
    async () => {
      const { delegators } = await request<DelegatorsResponse>(
        gql`
          ${delegatorFragment}
          query {
            delegators(
              first: ${perPage}
              skip: ${perPage * (currentPage - 1)}
              orderBy: ${sortParams.orderBy}
              orderDirection: ${sortParams.orderDirection}
              where: ${
                idFilters
                  ? `{ id_in: ${JSON.stringify(idFilters)} }`
                  : sortParams.orderBy === 'lastUndelegatedAt'
                  ? `{ lastUndelegatedAt_not: null }`
                  : null
              }
            ) {
              ...DelegatorFragment
            }
          }
        `,
      );

      return delegators.map(transformToRow);
    },
    { keepPreviousData: true },
  );

const getDelegators = async (skip: number) => {
  const { delegators } = await request<DelegatorsResponse>(
    gql`
      ${delegatorFragment}
      query {
        delegators(
          first: ${REQUEST_LIMIT}
          skip: ${skip}
        ) {
          ...DelegatorFragment
        }
      }
    `,
  );

  return delegators;
};

const download = (data: Array<Delegator>, sortParams: SortParams<DelegatorsRow>) =>
  downloadCsv(compose(map(transformToCsvRow), sortRows(sortParams), map(transformToRow))(data), 'delegators');

export const useDelegatorsCsv = (sortParams: SortParams<DelegatorsRow>) => {
  const { data: networkData } = useGraphNetwork();

  const { data, isFetching, refetch } = useQuery(
    ['all-delegators'],
    async () => {
      if (!networkData) {
        return Promise.reject(new Error('Delegators request cannot be sent without delegators count.'));
      }

      const delegators = await fetchAllParallel(networkData.delegatorCount, getDelegators);

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

type DelegatorsSearchResponse = {
  delegators: Array<{
    id: string;
    delegator: {
      id: string;
    } | null;
  }>;
};

export const useDelegatorsSearch = (searchTerm: string) => {
  return useQuery(
    ['delegators-search', searchTerm],
    async () => {
      const { delegators } = await request<DelegatorsSearchResponse>(
        gql`
        query {
          delegators: accountSearch(
            text: "${searchTerm}:* | 0x${searchTerm}:*",
            first: ${REQUEST_LIMIT}
          ) {
            id
            delegator {
              id
            }
          }
        }
      `,
      );

      return delegators.reduce<Array<string>>((acc, val) => {
        if (val.delegator) {
          acc.push(val.delegator.id);
        }

        return acc;
      }, []);
    },
    { enabled: isTermLongEnough(searchTerm) },
  );
};
