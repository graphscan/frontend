import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { compose, map } from "ramda";
import {
  DelegatorDelegation,
  DelegatorDelegationsRow,
  transformToRow,
  transformToCsvRow,
  mergeSplitDelegations,
} from "./delegator-delegations.model";
import { SortParams } from "../../../../../../model/sort.model";
import { DELEGATOR_DELEGATIONS_CACHE_KEY } from "../../../../../../services/delegator-delegations.service";
import {
  fetchAllConsecutively,
  request,
  REQUEST_LIMIT,
} from "../../../../../../services/graphql.service";
import { downloadCsv } from "../../../../../../utils/csv.utils";
import { sortRows } from "../../../../../../utils/table.utils";

type DelegatorDelegationsParams = {
  id: string;
  currentPage: number;
  perPage: number;
  sortParams: SortParams<DelegatorDelegationsRow>;
};

const delegatorDelegationFragment = gql`
  fragment DelegatorDelegationFragment on DelegatedStake {
    id
    indexer {
      id
      delegatorShares
      delegatedTokens
      delegationExchangeRate
      defaultDisplayName
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
  }
`;

type DelegatorDelegationsResponse = {
  delegatedStakes: Array<DelegatorDelegation>;
};

const createDelegatorDelegationsFetcher =
  (id: string) => async (skip: number) => {
    const { delegatedStakes } = await request<DelegatorDelegationsResponse>(
      gql`
      ${delegatorDelegationFragment}
      query {
        delegatedStakes(
          first: ${REQUEST_LIMIT}
          skip: ${skip}
          where: { delegator: ${JSON.stringify(id.toLowerCase())} }
        ) {
          ...DelegatorDelegationFragment
        }
      }
    `,
    );

    return delegatedStakes;
  };

export const useDelegatorDelegations = ({
  id,
  currentPage,
  perPage,
  sortParams,
}: DelegatorDelegationsParams) => {
  const { data, error, isFetching, isLoading } = useQuery(
    [DELEGATOR_DELEGATIONS_CACHE_KEY, id.toLowerCase()],
    async () => {
      const delegatedStakes = await fetchAllConsecutively(
        createDelegatorDelegationsFetcher(id),
      );
      return compose(
        map(transformToRow),
        mergeSplitDelegations,
      )(delegatedStakes);
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
  data: Array<DelegatorDelegationsRow>,
  sortParams: SortParams<DelegatorDelegationsRow>,
) =>
  downloadCsv(
    compose(map(transformToCsvRow), sortRows(sortParams))(data),
    "delegator-delegations",
  );

export const useDelegatorDelegationsCsv = (
  id: string,
  sortParams: SortParams<DelegatorDelegationsRow>,
) => {
  const { data, isFetching, refetch } = useQuery(
    [DELEGATOR_DELEGATIONS_CACHE_KEY, id.toLowerCase()],
    async () => {
      const delegatedStakes = await fetchAllConsecutively(
        createDelegatorDelegationsFetcher(id),
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
