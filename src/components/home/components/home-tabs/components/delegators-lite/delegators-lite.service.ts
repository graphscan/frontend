import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { compose, map } from 'ramda';
import { DelegatorLite, DelegatorsRowLite, transformToRow, transformToCsvRow } from './delegators-lite.model';
import { SortParams } from '../../../../../../model/sort.model';
import { useGraphNetwork } from '../../../../../../services/graph-network.service';
import { fetchAllParallel, request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';
import { isTermLongEnough } from '../../../../../../utils/account-search.utils';
import { downloadCsv } from '../../../../../../utils/csv.utils';
import { sortRows } from '../../../../../../utils/table.utils';

type DelegatorsParams = {
  currentPage: number;
  perPage: number;
  sortParams: SortParams<DelegatorsRowLite>;
  idFilters: Array<string> | null;
};

const delegatorFragmentLite = gql`
  fragment DelegatorFragmentLite on Delegator {
    id
    totalStakedTokens
    totalUnstakedTokens
    activeStakesCount
    totalRealizedRewards
  }
`;

type DelegatorsResponseLite = {
  delegators: Array<DelegatorLite>;
};

export const useDelegators = ({ currentPage, perPage, sortParams, idFilters }: DelegatorsParams) =>
  useQuery(
    ['delegators', currentPage, perPage, sortParams, idFilters],
    async () => {
      const { delegators } = await request<DelegatorsResponseLite>(
        gql`
          ${delegatorFragmentLite}
          query {
            delegators(
              first: ${perPage}
              skip: ${perPage * (currentPage - 1)}
              orderBy: ${sortParams.orderBy}
              orderDirection: ${sortParams.orderDirection}
              where: ${idFilters ? `{ id_in: ${JSON.stringify(idFilters)} }` : null}
            ) {
              ...DelegatorFragmentLite
              lastDelegationAt: stakes(
                first: 1, 
                where: {lastDelegatedAt_not: null}, 
                orderBy: lastDelegatedAt, 
                orderDirection: desc
              ) {
                id
                lastDelegatedAt
              }
              lastUnDelegationAt: stakes(
                first: 1, 
                where: {lastUndelegatedAt_not: null}, 
                orderBy: lastUndelegatedAt, 
                orderDirection: desc
              ) {
                id
                lastUndelegatedAt
              }
            }
          }
        `,
      );

      return delegators.map(transformToRow);
    },
    { keepPreviousData: true },
  );

const getDelegators = async (skip: number) => {
  const { delegators } = await request<DelegatorsResponseLite>(
    gql`
      ${delegatorFragmentLite}
      query {
        delegators(
          first: ${REQUEST_LIMIT}
          skip: ${skip}
        ) {
          ...DelegatorFragmentLite
          lastDelegationAt: stakes(
            first: 1, 
            where: {lastDelegatedAt_not: null}, 
            orderBy: lastDelegatedAt, 
            orderDirection: desc
          ) {
            id
            lastDelegatedAt
          }
          lastUnDelegationAt: stakes(
            first: 1, 
            where: {lastUndelegatedAt_not: null}, 
            orderBy: lastUndelegatedAt, 
            orderDirection: desc
          ) {
            id
            lastUndelegatedAt
          }
        }
      }
    `,
  );

  return delegators;
};

const download = (data: Array<DelegatorLite>, sortParams: SortParams<DelegatorsRowLite>) =>
  downloadCsv(compose(map(transformToCsvRow), sortRows(sortParams), map(transformToRow))(data), 'delegators');

export const useDelegatorsCsv = (sortParams: SortParams<DelegatorsRowLite>) => {
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
  delegators: Array<{ id: string }>;
};

export const useDelegatorsSearch = (searchTerm: string) => {
  return useQuery(
    ['delegators-search', searchTerm],
    async () => {
      const { delegators } = await request<DelegatorsSearchResponse>(
        gql`
          query {
            delegators: delegatorSearch(
              text: "${searchTerm}:* | 0x${searchTerm}:*",
              first: ${REQUEST_LIMIT}
            ) {
              id
            }
          }
        `,
      );

      return delegators.map(({ id }) => id);
    },
    { enabled: isTermLongEnough(searchTerm) },
  );
};
