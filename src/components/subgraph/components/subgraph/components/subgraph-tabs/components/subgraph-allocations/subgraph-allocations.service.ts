import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { compose, map } from "ramda";
import {
  SubgraphAllocation,
  SubgraphAllocationsRow,
  createTransformerToRow,
  transformToCsvRow,
} from "./subgraph-allocations.model";
import { SortParams } from "../../../../../../../../model/sort.model";
import { IndexerDailyData } from "../../../../../../../../model/allocation-rewards.model";
import {
  fetchAllConsecutively,
  request,
  requestAnalytics,
  REQUEST_LIMIT,
} from "../../../../../../../../services/graphql.service";
import { sortRows } from "../../../../../../../../utils/table.utils";
import { downloadCsv } from "../../../../../../../../utils/csv.utils";

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
      ownStakeRatio
      delegatedTokens
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

type IndexerDailyDataResponse = {
  indexerDailyDatas: Array<IndexerDailyData>;
};

const createDailyDataFetcher =
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

const fetchDailyDataByIndexer = async (
  allocations: Array<SubgraphAllocation>,
): Promise<Record<string, Array<IndexerDailyData>>> => {
  const closedIndexerIds = [
    ...new Set(
      allocations
        .filter((a) => a.status !== "Active" && a.closedAt !== null)
        .map((a) => a.indexer.id),
    ),
  ];

  if (closedIndexerIds.length === 0) {
    return {};
  }

  const results = await Promise.all(
    closedIndexerIds.map(async (indexerId) => {
      const dailyData = await fetchAllConsecutively(
        createDailyDataFetcher(indexerId),
      );
      return [indexerId, dailyData] as const;
    }),
  );

  return Object.fromEntries(results);
};

export const useSubgraphAllocations = ({
  id,
  currentPage,
  perPage,
  sortParams,
}: SubgraphAllocationsParams) =>
  useQuery(
    ["subgraph-allocations", id, currentPage, perPage, sortParams],
    async () => {
      const { subgraphVersion } = await request<SubgraphAllocationsResponse>(
        gql`
          ${subgraphAllocationFragment}
          query {
            subgraphVersion(id: ${JSON.stringify(id.startsWith("0x") ? id.toLowerCase() : id)}) {
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

      const allocations =
        subgraphVersion.subgraphDeployment.indexerAllocations;
      const dailyDataByIndexer = await fetchDailyDataByIndexer(allocations);

      return { allocations, dailyDataByIndexer };
    },
    { keepPreviousData: true },
  );

type SubgraphAllocationsCountResponse = {
  subgraphVersion: {
    subgraphDeployment: {
      indexerAllocations: Array<{ id: string }>;
    };
  };
};

const createAllocationsCountFetcher = (id: string) => async (skip: number) => {
  const { subgraphVersion } =
    await request<SubgraphAllocationsCountResponse>(gql`
        query {
          subgraphVersion(id: ${JSON.stringify(id.startsWith("0x") ? id.toLowerCase() : id)}) {
            id
            subgraphDeployment {
              id
              indexerAllocations(first: ${REQUEST_LIMIT}, skip: ${skip}) {
                id
              }
            }
          }
        }
      `);

  return subgraphVersion.subgraphDeployment.indexerAllocations;
};

export const useSubgraphAllocationsCount = (id: string) => {
  return useQuery(["subgraph-allocations-count", id], async () => {
    const allocations = await fetchAllConsecutively(
      createAllocationsCountFetcher(id),
    );

    return allocations.length;
  });
};

const download = (
  data: Array<SubgraphAllocation>,
  dailyDataByIndexer: Record<string, Array<IndexerDailyData>>,
  sortParams: SortParams<SubgraphAllocationsRow>,
) =>
  downloadCsv(
    compose(
      map(transformToCsvRow),
      sortRows(sortParams),
      map(createTransformerToRow({ dailyDataByIndexer })),
    )(data),
    "subgraph-allocations",
  );

const createSubgraphAllocationsFetcher =
  (id: string) => async (skip: number) => {
    const { subgraphVersion } = await request<SubgraphAllocationsResponse>(gql`
    ${subgraphAllocationFragment}
    query {
      subgraphVersion(id: ${JSON.stringify(id.startsWith("0x") ? id.toLowerCase() : id)}) {
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

export const useSubgraphAllocationsCsv = (
  id: string,
  sortParams: SortParams<SubgraphAllocationsRow>,
) => {
  const { data, isFetching, refetch } = useQuery(
    ["all-subgraph-allocations", id],
    async () => {
      const allocations = await fetchAllConsecutively(
        createSubgraphAllocationsFetcher(id),
      );
      const dailyDataByIndexer = await fetchDailyDataByIndexer(allocations);

      return { allocations, dailyDataByIndexer };
    },
    { enabled: false },
  );

  const handleCsvDownload = useCallback(() => {
    data
      ? download(data.allocations, data.dailyDataByIndexer, sortParams)
      : refetch().then((res) =>
          res.data
            ? download(
                res.data.allocations,
                res.data.dailyDataByIndexer,
                sortParams,
              )
            : res,
        );
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
