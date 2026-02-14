import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { compose, map } from "ramda";
import {
  IndexerDelegator,
  IndexerDelegatorsRow,
  transformToRow,
  transformToCsvRow,
  mergeSplitDelegations,
} from "./indexer-delegators.model";
import { SortParams } from "../../../../../../model/sort.model";
import { INDEXER_DELEGATORS_CACHE_KEY } from "../../../../../../services/indexer-delegators.service";
import {
  fetchAllConsecutively,
  request,
  REQUEST_LIMIT,
} from "../../../../../../services/graphql.service";
import { downloadCsv } from "../../../../../../utils/csv.utils";
import { sortRows } from "../../../../../../utils/table.utils";

type IndexerDelegatorsParams = {
  id: string;
  currentPage: number;
  perPage: number;
  sortParams: SortParams<IndexerDelegatorsRow>;
};

const indexerDelegatorFragment = gql`
  fragment IndexerDelegatorFragment on DelegatedStake {
    id
    delegator {
      id
    }
    shareAmount
    personalExchangeRate
    stakedTokens
    unstakedTokens
    createdAt
    lastDelegatedAt
    lastUndelegatedAt
    lockedUntil
    lockedTokens
    indexer {
      id
      delegatorShares
      delegatedTokens
      delegatedThawingTokens
    }
  }
`;

type IndexerDelegatorsResponse = {
  delegatedStakes: Array<IndexerDelegator>;
};

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

export const useIndexerDelegators = ({
  id,
  currentPage,
  perPage,
  sortParams,
}: IndexerDelegatorsParams) => {
  const { data, error, isFetching, isLoading } = useQuery(
    [INDEXER_DELEGATORS_CACHE_KEY, id.toLowerCase()],
    async () => {
      const delegatedStakes = await fetchAllConsecutively(
        createIndexerDelegatorsFetcher(id),
      );
      const rows = compose(
        map(transformToRow),
        mergeSplitDelegations,
      )(delegatedStakes);

      return rows;
    },
  );

  const sortedAndPaginatedData = useMemo(() => {
    if (!data) return { rows: [], total: 0 };

    const sorted = sortRows(sortParams)(data);
    const paginated = sorted.slice(
      perPage * (currentPage - 1),
      perPage * currentPage,
    );

    return { rows: paginated, total: sorted.length };
  }, [data, sortParams, currentPage, perPage]);

  return {
    data: sortedAndPaginatedData.rows,
    total: sortedAndPaginatedData.total,
    error,
    isFetching,
    isLoading,
  };
};

const download = (
  data: Array<IndexerDelegatorsRow>,
  sortParams: SortParams<IndexerDelegatorsRow>,
) =>
  downloadCsv(
    compose(map(transformToCsvRow), sortRows(sortParams))(data),
    "indexer-delegators",
  );

export const useIndexerDelegatorsCsv = (
  id: string,
  sortParams: SortParams<IndexerDelegatorsRow>,
) => {
  const { data, isFetching, refetch } = useQuery(
    [INDEXER_DELEGATORS_CACHE_KEY, id.toLowerCase()],
    async () => {
      const delegatedStakes = await fetchAllConsecutively(
        createIndexerDelegatorsFetcher(id),
      );
      return compose(
        map(transformToRow),
        mergeSplitDelegations,
      )(delegatedStakes);
    },
    { enabled: false },
  );

  const handleCsvDownload = useCallback(() => {
    data
      ? download(data, sortParams)
      : refetch().then((res) =>
          res.data ? download(res.data, sortParams) : res,
        );
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};
