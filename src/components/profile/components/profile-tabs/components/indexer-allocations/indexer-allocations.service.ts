import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { compose, map } from "ramda";
import {
  IndexerAllocation,
  IndexerAllocationsRow,
  createTransformerToRows,
  transformToCsvRow,
} from "./indexer-allocations.model";
import { SortParams } from "../../../../../../model/sort.model";
import { IndexerDailyData } from "../../../../../../model/allocation-rewards.model";
import {
  fetchAllConsecutively,
  fetchAllParallel,
  request,
  requestAnalytics,
  REQUEST_LIMIT,
} from "../../../../../../services/graphql.service";
import { downloadCsv } from "../../../../../../utils/csv.utils";
import { sortRows } from "../../../../../../utils/table.utils";
import { useGraphNetwork } from "../../../../../../services/graph-network.service";

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
    isLegacy
    provision {
      dataService {
        id
      }
    }
    indexer {
      id
      indexingRewardCut
      ownStakeRatio
      delegatedTokens
    }
    subgraphDeployment {
      id
      stakedTokens
      signalledTokens
      manifest {
        network
      }
      versions(first: ${REQUEST_LIMIT}, where: {entityVersion: 2}) {
        id
        subgraph {
          id
          active
          createdAt
          metadata {
            image
            displayName
          }
          currentVersion {
            id
            subgraphDeployment {
              id
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

type IndexerAllocationsResponse = {
  allocations: Array<IndexerAllocation>;
};

type IndexerDailyDataResponse = {
  indexerDailyDatas: Array<IndexerDailyData>;
};

const createIndexerDailyDataFetcher =
  (indexerId: string) => async (skip: number) => {
    const { indexerDailyDatas } =
      await requestAnalytics<IndexerDailyDataResponse>(gql`
        query {
          indexerDailyDatas(
            first: ${REQUEST_LIMIT}
            skip: ${skip}
            orderBy: dayEnd
            orderDirection: desc
            where: { indexer: ${JSON.stringify(indexerId.toLowerCase())} }
          ) {
            dayEnd
            dayStart
            ownStakeRatio
            delegatedTokens
          }
        }
      `);
    return indexerDailyDatas;
  };

const fetchIndexerDailyData = (indexerId: string) =>
  fetchAllConsecutively(createIndexerDailyDataFetcher(indexerId));

export const useIndexerAllocations = ({
  id,
  currentPage,
  perPage,
  sortParams,
}: IndexerAllocationsParams) => {
  const { data: networkData } = useGraphNetwork();

  return useQuery(
    ["indexer-allocations", id, currentPage, perPage, sortParams],
    async () => {
      if (!networkData) {
        return Promise.reject(
          new Error(
            "Indexer Allocations request cannot be sent without network data.",
          ),
        );
      }

      const { totalTokensAllocated, totalTokensSignalled, currentEpoch } =
        networkData;

      const [{ allocations }, indexerDailyData] = await Promise.all([
        request<IndexerAllocationsResponse>(
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
        ),
        fetchIndexerDailyData(id),
      ]);

      return {
        allocations,
        indexerDailyData,
        totalTokensAllocated,
        totalTokensSignalled,
        currentEpoch,
      };
    },
    { enabled: Boolean(networkData), keepPreviousData: true },
  );
};

type IndexerAllocationsCountResponse = {
  indexer: {
    id: string;
    totalAllocationCount: string;
  };
};

export const useIndexerAllocationsCount = (id: string) => {
  return useQuery(["indexer-allocations-count", id], async () => {
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

const download = (
  data: {
    allocations: Array<IndexerAllocation>;
    totalTokensAllocated: string;
    totalTokensSignalled: string;
  },
  indexerDailyData: Array<IndexerDailyData>,
  sortParams: SortParams<IndexerAllocationsRow>,
) =>
  downloadCsv(
    compose(
      map(transformToCsvRow),
      sortRows(sortParams),
      createTransformerToRows({}, indexerDailyData),
    )(data),
    "indexer-allocations",
  );

const createIndexerAllocationsFetcher =
  (id: string) => async (skip: number) => {
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

export const useIndexerAllocationsCsv = (
  id: string,
  sortParams: SortParams<IndexerAllocationsRow>,
) => {
  const { data: allocationsCount } = useIndexerAllocationsCount(id);
  const { data: networkData } = useGraphNetwork();

  const { data, isFetching, refetch } = useQuery(
    ["all-indexer-allocations", id],
    async () => {
      if (!allocationsCount) {
        return Promise.reject(
          new Error(
            "Indexer Allocations request cannot be sent without allocations count.",
          ),
        );
      }

      if (!networkData) {
        return Promise.reject(
          new Error(
            "Indexer Allocations request cannot be sent without network data.",
          ),
        );
      }

      const { totalTokensAllocated, totalTokensSignalled } = networkData;
      const [allocations, indexerDailyData] = await Promise.all([
        fetchAllParallel(
          allocationsCount,
          createIndexerAllocationsFetcher(id),
        ),
        fetchIndexerDailyData(id),
      ]);

      return {
        allocations,
        indexerDailyData,
        totalTokensAllocated,
        totalTokensSignalled,
      };
    },
    { enabled: false },
  );

  const handleCsvDownload = useCallback(() => {
    data
      ? download(data, data.indexerDailyData, sortParams)
      : refetch().then((res) =>
          res.data
            ? download(res.data, res.data.indexerDailyData, sortParams)
            : res,
        );
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
