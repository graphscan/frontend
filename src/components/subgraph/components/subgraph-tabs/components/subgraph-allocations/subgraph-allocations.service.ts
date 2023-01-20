import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { compose, map } from 'ramda';
import {
  SubgraphAllocation,
  SubgraphAllocationsRow,
  createTransformerToRow,
  transformToCsvRow,
} from './subgraph-allocations.model';
import { SortParams } from '../../../../../../model/sort.model';
import { fetchAllParallel, request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';
import { sortRows } from '../../../../../../utils/table.utils';
import { downloadCsv } from '../../../../../../utils/csv.utils';

type SubgraphAllocationsParams = {
  id: string;
  currentPage: number;
  perPage: number;
  sortParams: SortParams<SubgraphAllocationsRow>;
};

const subgraphAllocationFragment = gql`
  fragment SubgraphAllocationFragment on Allocation {
    id
    indexer {
      id
      defaultDisplayName
      indexingRewardCut
      indexingRewardEffectiveCut
    }
    status
    allocatedTokens
    createdAt
    createdAtEpoch
    closedAt
    closedAtEpoch
    indexingRewardCutAtClose
    indexingRewardEffectiveCutAtClose
    indexingIndexerRewards
    indexingDelegatorRewards
    poi
  }
`;

type SubgraphAllocationsResponse = {
  subgraphVersion: {
    subgraphDeployment: {
      indexerAllocations: Array<SubgraphAllocation>;
    };
  };
};

export const useSubgraphAllocations = ({ id, currentPage, perPage, sortParams }: SubgraphAllocationsParams) =>
  useQuery(
    ['subgraph-allocations', id, currentPage, perPage, sortParams],
    async () => {
      const { subgraphVersion } = await request<SubgraphAllocationsResponse>(
        gql`
          ${subgraphAllocationFragment}
          query {
            subgraphVersion(id: ${JSON.stringify(id.startsWith('0x') ? id.toLowerCase() : id)}) {
              subgraphDeployment {
                indexerAllocations(
                  first: ${perPage},
                  skip: ${perPage * (currentPage - 1)},
                  orderBy: ${sortParams.orderBy},
                  orderDirection: ${sortParams.orderDirection},
                ) {
                  ...SubgraphAllocationFragment
                }
              }
            }
          }
        `,
      );

      return subgraphVersion.subgraphDeployment.indexerAllocations;
    },
    { keepPreviousData: true },
  );

type SubgraphAllocationsCountResponse = {
  subgraphVersion: {
    subgraphDeployment: {
      allocationsCount: number;
    };
  };
};

export const useSubgraphAllocationsCount = (id: string) => {
  return useQuery(['subgraph-allocations-count', id], async () => {
    const { subgraphVersion } = await request<SubgraphAllocationsCountResponse>(
      gql`
        query {
          subgraphVersion(id: ${JSON.stringify(id.startsWith('0x') ? id.toLowerCase() : id)}) {
            id
            subgraphDeployment {
              id
              allocationsCount
            }
          }
        }
      `,
    );

    return subgraphVersion.subgraphDeployment.allocationsCount;
  });
};

const download = (data: Array<SubgraphAllocation>, sortParams: SortParams<SubgraphAllocationsRow>) =>
  downloadCsv(
    compose(map(transformToCsvRow), sortRows(sortParams), map(createTransformerToRow()))(data),
    'subgraph-allocations',
  );

const createSubgraphAllocationsFetcher = (id: string) => async (skip: number) => {
  const { subgraphVersion } = await request<SubgraphAllocationsResponse>(gql`
    ${subgraphAllocationFragment}
    query {
      subgraphVersion(id: ${JSON.stringify(id.startsWith('0x') ? id.toLowerCase() : id)}) {
        id
        subgraphDeployment {
          id
          indexerAllocations(
            first: ${REQUEST_LIMIT},
            skip: ${skip},
          ) {
            ...SubgraphAllocationFragment
          }
        }
      }
    }
  `);

  return subgraphVersion.subgraphDeployment.indexerAllocations;
};

export const useSubgraphAllocationsCsv = (id: string, sortParams: SortParams<SubgraphAllocationsRow>) => {
  const { data: allocationsCount } = useSubgraphAllocationsCount(id);

  const { data, isFetching, refetch } = useQuery(
    ['all-subgraph-allocations', id],
    async () => {
      if (!allocationsCount) {
        return Promise.reject(
          new Error('Subgraph allocations request cannot be sent without allocations count.'),
        );
      }

      const allocations = await fetchAllParallel(allocationsCount, createSubgraphAllocationsFetcher(id));

      return allocations;
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
