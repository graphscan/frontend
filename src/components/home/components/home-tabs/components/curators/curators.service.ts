import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { compose, map } from "ramda";
import {
  Curator,
  CuratorsRow,
  transformToRow,
  transformToCsvRow,
} from "./curators.model";
import { DISCARDED_CURATORS_COUNT } from "../../../../../../model/curators.model";
import { SortParams } from "../../../../../../model/sort.model";
import { useGraphNetwork } from "../../../../../../services/graph-network.service";
import {
  fetchAllParallel,
  request,
  REQUEST_LIMIT,
} from "../../../../../../services/graphql.service";
import { isTermLongEnough } from "../../../../../../utils/account-search.utils";
import { downloadCsv } from "../../../../../../utils/csv.utils";
import { sortRows } from "../../../../../../utils/table.utils";

type CuratorsParams = {
  currentPage: number;
  perPage: number;
  sortParams: SortParams<CuratorsRow>;
  idFilters: Array<string> | null;
};

// Fields that exist in the GraphQL schema and can be sorted server-side
// Maps row field names to their corresponding GraphQL schema field names
const serverSortFieldsMap: Partial<Record<keyof CuratorsRow, string>> = {
  id: "id",
  allCurrentGRTValue: "totalSignalAverageCostBasis",
  totalNameSignalledTokens: "totalSignalledTokens",
  totalNameUnsignalledTokens: "totalUnsignalledTokens",
};

// Fields that are computed client-side and cannot be sorted server-side
const clientSortFields: Array<keyof CuratorsRow> = [
  "PLGrt",
  "currentNameSignalCount",
  "lastSignaledAt",
  "lastUnsignaledAt",
];

const isClientSortField = (field: keyof CuratorsRow): boolean =>
  clientSortFields.includes(field);

const getServerSortField = (field: keyof CuratorsRow): string =>
  serverSortFieldsMap[field] ?? "id";

const curatorFragment = gql`
  fragment CuratorFragment on Curator {
    id
    currentNameSignalCount: nameSignalCount
    currentSignalCount: signalCount
    allCurrentGRTValue: totalSignalAverageCostBasis
    totalNameSignalledTokens: totalSignalledTokens
    totalNameUnsignalledTokens: totalUnsignalledTokens
  }
`;

type TransactionWithSigner = {
  signer: { id: string };
  timestamp: number;
};

type CuratorTimestampsResponse = {
  nameSignalMints: Array<TransactionWithSigner>;
  nameSignalBurns: Array<TransactionWithSigner>;
  signalMints: Array<TransactionWithSigner>;
  signalBurns: Array<TransactionWithSigner>;
};

const fetchCuratorTimestamps = async (curatorIds: Array<string>) => {
  if (curatorIds.length === 0)
    return new Map<
      string,
      { lastSignaledAt: number; lastUnsignaledAt: number }
    >();

  const lowercaseIds = curatorIds.map((id) => id.toLowerCase());

  const response = await request<CuratorTimestampsResponse>(gql`
    query {
      nameSignalMints: nameSignalTransactions(
        first: ${REQUEST_LIMIT}
        where: {
          or: [
            { signer_in: ${JSON.stringify(lowercaseIds)}, type: MintSignal },
            { signer_in: ${JSON.stringify(lowercaseIds)}, type: MintNSignal }
          ]
        }
        orderBy: timestamp
        orderDirection: desc
      ) {
        signer { id }
        timestamp
      }
      nameSignalBurns: nameSignalTransactions(
        first: ${REQUEST_LIMIT}
        where: {
          or: [
            { signer_in: ${JSON.stringify(lowercaseIds)}, type: BurnNSignal },
            { signer_in: ${JSON.stringify(lowercaseIds)}, type: BurnSignal }
          ]
        }
        orderBy: timestamp
        orderDirection: desc
      ) {
        signer { id }
        timestamp
      }
      signalMints: signalTransactions(
        first: ${REQUEST_LIMIT}
        where: {
          signer_in: ${JSON.stringify(lowercaseIds)}
          type: MintSignal
        }
        orderBy: timestamp
        orderDirection: desc
      ) {
        signer { id }
        timestamp
      }
      signalBurns: signalTransactions(
        first: ${REQUEST_LIMIT}
        where: {
          signer_in: ${JSON.stringify(lowercaseIds)}
          type: BurnSignal
        }
        orderBy: timestamp
        orderDirection: desc
      ) {
        signer { id }
        timestamp
      }
    }
  `);

  // Build map with latest timestamps for each curator
  const timestampsMap = new Map<
    string,
    { lastSignaledAt: number; lastUnsignaledAt: number }
  >();

  // Initialize all curators with 0 timestamps
  curatorIds.forEach((id) => {
    timestampsMap.set(id.toLowerCase(), {
      lastSignaledAt: 0,
      lastUnsignaledAt: 0,
    });
  });

  // Process mint transactions (both nameSignal and signal)
  const allMints = [...response.nameSignalMints, ...response.signalMints];
  allMints.forEach(({ signer, timestamp }) => {
    const current = timestampsMap.get(signer.id);
    if (current && timestamp > current.lastSignaledAt) {
      current.lastSignaledAt = timestamp;
    }
  });

  // Process burn transactions (both nameSignal and signal)
  const allBurns = [...response.nameSignalBurns, ...response.signalBurns];
  allBurns.forEach(({ signer, timestamp }) => {
    const current = timestampsMap.get(signer.id);
    if (current && timestamp > current.lastUnsignaledAt) {
      current.lastUnsignaledAt = timestamp;
    }
  });

  return timestampsMap;
};

type CuratorsResponse = {
  curators: Array<Curator>;
};

const fetchCuratorsPage = async (
  perPage: number,
  skip: number,
  orderBy: string,
  orderDirection: string,
  gns: string,
  idFilters: Array<string> | null,
) => {
  const { curators } = await request<CuratorsResponse>(gql`
    ${curatorFragment}
    query {
      curators(
        first: ${perPage}
        skip: ${skip}
        orderBy: ${orderBy}
        orderDirection: ${orderDirection}
        where: {
          id_not: ${JSON.stringify(gns)}
          ${idFilters ? `, id_in: ${JSON.stringify(idFilters)}` : ""}
        }
      ) {
        ...CuratorFragment
      }
    }
  `);

  return curators;
};

const fetchAllCuratorsForClientSort = async (
  gns: string,
  idFilters: Array<string> | null,
) => {
  const fetchPage = async (skip: number) => {
    const { curators } = await request<CuratorsResponse>(gql`
      ${curatorFragment}
      query {
        curators(
          first: ${REQUEST_LIMIT}
          skip: ${skip}
          where: {
            id_not: ${JSON.stringify(gns)}
            ${idFilters ? `, id_in: ${JSON.stringify(idFilters)}` : ""}
          }
        ) {
          ...CuratorFragment
        }
      }
    `);

    return curators;
  };

  const allCurators: Array<Curator> = [];
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const page = await fetchPage(skip);
    allCurators.push(...page);
    hasMore = page.length === REQUEST_LIMIT;
    skip += REQUEST_LIMIT;
  }

  return allCurators;
};

export const useCurators = ({
  currentPage,
  perPage,
  sortParams,
  idFilters,
}: CuratorsParams) => {
  const { data: networkData } = useGraphNetwork();
  const needsClientSort = isClientSortField(sortParams.orderBy);

  return useQuery(
    ["curators", currentPage, perPage, sortParams, idFilters],
    async () => {
      if (!networkData) {
        return Promise.reject(
          new Error("Curators request cannot be sent without network data."),
        );
      }

      let curators: Array<Curator>;

      if (needsClientSort) {
        // Fetch all curators for client-side sorting
        curators = await fetchAllCuratorsForClientSort(
          networkData.gns,
          idFilters,
        );
      } else {
        // Use server-side sorting with proper field mapping
        const serverSortField = getServerSortField(sortParams.orderBy);
        curators = await fetchCuratorsPage(
          perPage,
          perPage * (currentPage - 1),
          serverSortField,
          sortParams.orderDirection,
          networkData.gns,
          idFilters,
        );
      }

      const timestamps = await fetchCuratorTimestamps(
        curators.map((c) => c.id),
      );

      const rows = curators.map((curator) => {
        const curatorTimestamps = timestamps.get(curator.id);
        return transformToRow({
          ...curator,
          lastSignaledAt: curatorTimestamps?.lastSignaledAt ?? 0,
          lastUnsignaledAt: curatorTimestamps?.lastUnsignaledAt ?? 0,
        });
      });

      if (needsClientSort) {
        // Sort client-side and paginate
        const sortedRows = sortRows(sortParams)(rows);
        const start = perPage * (currentPage - 1);
        return sortedRows.slice(start, start + perPage);
      }

      return rows;
    },
    { enabled: Boolean(networkData), keepPreviousData: true },
  );
};

type CuratorWithTimestamps = Curator & {
  lastSignaledAt: number;
  lastUnsignaledAt: number;
};

const getCurators = async (skip: number) => {
  const { curators } = await request<CuratorsResponse>(gql`
    ${curatorFragment}
    query {
      curators(
        first: ${REQUEST_LIMIT}
        skip: ${skip}
      ) {
        ...CuratorFragment
      }
    }
  `);

  return curators;
};

const download = async (
  data: Array<Curator>,
  sortParams: SortParams<CuratorsRow>,
) => {
  const timestamps = await fetchCuratorTimestamps(data.map((c) => c.id));
  const dataWithTimestamps: Array<CuratorWithTimestamps> = data.map(
    (curator) => {
      const curatorTimestamps = timestamps.get(curator.id);
      return {
        ...curator,
        lastSignaledAt: curatorTimestamps?.lastSignaledAt ?? 0,
        lastUnsignaledAt: curatorTimestamps?.lastUnsignaledAt ?? 0,
      };
    },
  );
  downloadCsv(
    compose(
      map(transformToCsvRow),
      sortRows(sortParams),
      map(transformToRow),
    )(dataWithTimestamps),
    "curators",
  );
};

export const useCuratorsCsv = (sortParams: SortParams<CuratorsRow>) => {
  const { data: networkData } = useGraphNetwork();

  const { data, isFetching, refetch } = useQuery(
    ["all-curators"],
    async () => {
      if (!networkData) {
        return Promise.reject(
          new Error("Curators request cannot be sent without curators count."),
        );
      }

      const curators = await fetchAllParallel(
        networkData.curatorCount - DISCARDED_CURATORS_COUNT,
        getCurators,
      );

      return curators;
    },
    { enabled: false },
  );

  const handleCsvDownload = useCallback(async () => {
    if (data) {
      await download(data, sortParams);
    } else {
      const res = await refetch();
      if (res.data) {
        await download(res.data, sortParams);
      }
    }
  }, [data, refetch, sortParams]);

  return {
    isCsvLoading: isFetching,
    handleCsvDownload,
  };
};

type CuratorsSearchResponse = {
  curators: Array<{
    id: string;
  }>;
};

export const useCuratorsSearch = (searchTerm: string) => {
  return useQuery(
    ["curators-search", searchTerm],
    async () => {
      const { curators } = await request<CuratorsSearchResponse>(gql`
        query {
          curators: curatorSearch(
            text: "${searchTerm}:* | 0x${searchTerm}:*",
            first: ${REQUEST_LIMIT}
          ) {
            id
          }
        }
      `);

      return curators.map((curator) => curator.id);
    },
    { enabled: isTermLongEnough(searchTerm) },
  );
};
