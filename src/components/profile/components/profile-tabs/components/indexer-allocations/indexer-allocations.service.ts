import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { compose, map } from 'ramda';
import {
  IndexerAllocation,
  IndexerAllocationsRow,
  createTransformerToRow,
  transformToCsvRow,
} from './indexer-allocations.model';
import { SortParams } from '../../../../../../model/sort.model';
import { fetchAllParallel, request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';
import { downloadCsv } from '../../../../../../utils/csv.utils';
import { sortRows } from '../../../../../../utils/table.utils';

type IndexerAllocationsParams = {
  id: string;
  currentPage: number;
  perPage: number;
  sortParams: SortParams<IndexerAllocationsRow>;
};

const indexerAllocationFragment = gql`
  fragment IndexerAllocationFragment on Allocation {
    id
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
    queryFeesCollected
    queryFeeRebates
    poi
    indexer {
      id
      indexingRewardCut
      indexingRewardEffectiveCut
    }
    subgraphDeployment {
      id
      versions(first: ${REQUEST_LIMIT}, where: {entityVersion: 2}) {
        id
        subgraph {
          id
          active
          image
          displayName
          createdAt
          currentVersion {
            id
            subgraphDeployment {
              id
              stakedTokens
              signalledTokens
              deniedAt
              versions(first: ${REQUEST_LIMIT}, where: {entityVersion: 2}) {
                id
                subgraph {
                  id
                  currentVersion {
                    id
                  }
                }
                subgraphDeployment {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

export type IndexerAllocationsResponse = {
  allocations: Array<IndexerAllocation>;
};

export const useIndexerAllocations = ({ id, currentPage, perPage, sortParams }: IndexerAllocationsParams) =>
  useQuery(
    ['indexer-allocations', id, currentPage, perPage, sortParams],
    async () => {
      const { allocations } = await request<IndexerAllocationsResponse>(
        gql`
          ${indexerAllocationFragment}
          query {
            allocations(
              first: ${perPage}
              skip: ${perPage * (currentPage - 1)}
              orderBy: ${sortParams.orderBy}
              orderDirection: ${sortParams.orderDirection}
              where: { indexer: ${JSON.stringify(id.toLowerCase())} }
            ) {
              ...IndexerAllocationFragment
            }
          }
        `,
      );

      return allocations;
    },
    { keepPreviousData: true },
  );

type IndexerAllocationsCountResponse = {
  indexer: {
    id: string;
    totalAllocationCount: string;
  };
};

export const useIndexerAllocationsCount = (id: string) => {
  return useQuery(['indexer-allocations-count', id], async () => {
    const response = await request<IndexerAllocationsCountResponse>(
      gql`
        query {
          indexer(id: ${JSON.stringify(id.toLowerCase())}) {
            id
            totalAllocationCount
          }
        }
      `,
    );

    return Number(response.indexer.totalAllocationCount);
  });
};

const download = (data: Array<IndexerAllocation>, sortParams: SortParams<IndexerAllocationsRow>) =>
  downloadCsv(
    compose(map(transformToCsvRow), sortRows(sortParams), map(createTransformerToRow()))(data),
    'indexer-allocations',
  );

const createIndexerAllocationsFetcher = (id: string) => async (skip: number) => {
  const { allocations } = await request<IndexerAllocationsResponse>(gql`
    ${indexerAllocationFragment}
    query {
      allocations(
        first: ${REQUEST_LIMIT}
        skip: ${skip}
        where: { indexer: ${JSON.stringify(id.toLowerCase())} }
      ) {
        ...IndexerAllocationFragment
      }
    }
  `);

  return allocations;
};

export const useIndexerAllocationsCsv = (id: string, sortParams: SortParams<IndexerAllocationsRow>) => {
  const { data: allocationsCount } = useIndexerAllocationsCount(id);

  const { data, isFetching, refetch } = useQuery(
    ['all-indexer-allocations', id],
    async () => {
      if (!allocationsCount) {
        return Promise.reject(
          new Error('Indexer Allocations request cannot be sent without allocations count.'),
        );
      }

      const allocations = await fetchAllParallel(allocationsCount, createIndexerAllocationsFetcher(id));

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
