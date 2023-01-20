import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { compose, map } from 'ramda';
import {
  DelegatorDelegationLite,
  DelegatorDelegationsRowLite,
  transformToRow,
  transformToCsvRow,
} from './delegator-delegations-lite.model';
import { SortParams } from '../../../../../../model/sort.model';
import { DELEGATOR_DELEGATIONS_CACHE_KEY } from '../../../../../../services/delegator-delegations.service';
import { fetchAllParallel, request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';
import { downloadCsv } from '../../../../../../utils/csv.utils';
import { sortRows } from '../../../../../../utils/table.utils';

type DelegatorDelegationsParams = {
  id: string;
  currentPage: number;
  perPage: number;
  sortParams: SortParams<DelegatorDelegationsRowLite>;
};

const delegatorDelegationFragmentLite = gql`
  fragment DelegatorDelegationFragmentLite on DelegatedStake {
    id
    indexer {
      id
      delegatedTokens
      delegatorShares
      defaultDisplayName
    }
    shareAmount
    stakedTokens
    unstakedTokens
    realizedRewards
    createdAt
    lastUndelegatedAt
    lockedUntil
    lockedTokens
  }
`;

type DelegatorDelegationsResponse = {
  delegatedStakes: Array<DelegatorDelegationLite>;
};

export const useDelegatorDelegations = ({
  id,
  currentPage,
  perPage,
  sortParams,
}: DelegatorDelegationsParams) =>
  useQuery(
    [DELEGATOR_DELEGATIONS_CACHE_KEY, id.toLowerCase(), currentPage, perPage, sortParams],
    async () => {
      const { delegatedStakes } = await request<DelegatorDelegationsResponse>(
        gql`
          ${delegatorDelegationFragmentLite}
          query {
            delegatedStakes(
              first: ${perPage}
              skip: ${perPage * (currentPage - 1)}
              orderBy: ${sortParams.orderBy}
              orderDirection: ${sortParams.orderDirection}
              where: { delegator: ${JSON.stringify(id.toLowerCase())} }
            ) {
              ...DelegatorDelegationFragmentLite
            }
          }
        `,
      );

      return delegatedStakes.map(transformToRow);
    },
    { keepPreviousData: true },
  );

const createDelegatorDelegationsFetcher = (id: string) => async (skip: number) => {
  const { delegatedStakes } = await request<DelegatorDelegationsResponse>(
    gql`
      ${delegatorDelegationFragmentLite}
      query {
        delegatedStakes(
          first: ${REQUEST_LIMIT}
          skip: ${skip}
          where: { delegator: ${JSON.stringify(id.toLowerCase())} }
        ) {
          ...DelegatorDelegationFragmentLite
        }
      }
    `,
  );

  return delegatedStakes;
};

type DelegatorDelegationsCountResponse = {
  delegator: {
    id: string;
    stakesCount: number;
  };
};

export const useDelegatorDelegationsCount = (id: string) => {
  return useQuery(['delegator-delegations-count', id], async () => {
    const response = await request<DelegatorDelegationsCountResponse>(
      gql`
        query {
          delegator(id: ${JSON.stringify(id.toLowerCase())}) {
            id
            stakesCount
          }
        }
      `,
    );

    return Number(response.delegator.stakesCount);
  });
};

const download = (
  data: Array<DelegatorDelegationLite>,
  sortParams: SortParams<DelegatorDelegationsRowLite>,
) =>
  downloadCsv(
    compose(map(transformToCsvRow), sortRows(sortParams), map(transformToRow))(data),
    'delegator-delegations',
  );

export const useDelegatorDelegationsCsv = (
  id: string,
  sortParams: SortParams<DelegatorDelegationsRowLite>,
) => {
  const { data: delegationsCount } = useDelegatorDelegationsCount(id);

  const { data, isFetching, refetch } = useQuery(
    ['all-delegator-delegations', id],
    async () => {
      if (!delegationsCount) {
        return Promise.reject(
          new Error('Delegator Delegations request cannot be sent without delegations count.'),
        );
      }

      const delegations = await fetchAllParallel(delegationsCount, createDelegatorDelegationsFetcher(id));

      return delegations;
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
