import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { compose, map } from 'ramda';
import { CuratorLite, CuratorsRowLite, transformToRow, transformToCsvRow } from './curators-lite.model';
import { DISCARDED_CURATORS_COUNT } from '../../../../../../model/curators.model';
import { SortParams } from '../../../../../../model/sort.model';
import { useGraphNetwork } from '../../../../../../services/graph-network.service';
import { fetchAllParallel, request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';
import { isTermLongEnough } from '../../../../../../utils/account-search.utils';
import { downloadCsv } from '../../../../../../utils/csv.utils';
import { sortRows } from '../../../../../../utils/table.utils';

type CuratorsParams = {
  currentPage: number;
  perPage: number;
  sortParams: SortParams<CuratorsRowLite>;
  idFilters: Array<string> | null;
};

const curatorFragmentLite = gql`
  fragment CuratorFragmentLite on Curator {
    id
    activeNameSignalCount
    activeSignalCount
    totalNameSignalledTokens
    totalNameUnsignalledTokens
  }
`;

type CuratorsResponseLite = {
  curators: Array<CuratorLite>;
};

export const useCurators = ({ currentPage, perPage, sortParams, idFilters }: CuratorsParams) => {
  const { data: networkData } = useGraphNetwork();

  return useQuery(
    ['curators', currentPage, perPage, sortParams, idFilters],
    async () => {
      if (!networkData) {
        return Promise.reject(new Error('Curators request cannot be sent without network data.'));
      }

      const { curators } = await request<CuratorsResponseLite>(gql`
        ${curatorFragmentLite}
        query {
          curators(
            first: ${perPage}
            skip: ${perPage * (currentPage - 1)}
            orderBy: ${sortParams.orderBy}
            orderDirection: ${sortParams.orderDirection}
            where: {
              id_not: ${JSON.stringify(networkData.gns)}, 
              ${idFilters ? `id_in: ${JSON.stringify(idFilters)}` : ''}
            }
          ) {
            ...CuratorFragmentLite
          }
        }
      `);

      return curators.map(transformToRow);
    },
    { enabled: Boolean(networkData), keepPreviousData: true },
  );
};

const getCurators = async (skip: number) => {
  const { curators } = await request<CuratorsResponseLite>(gql`
    ${curatorFragmentLite}
    query {
      curators(
        first: ${REQUEST_LIMIT}
        skip: ${skip}
      ) {
        ...CuratorFragmentLite
      }
    }
  `);

  return curators;
};

const download = (data: Array<CuratorLite>, sortParams: SortParams<CuratorsRowLite>) =>
  downloadCsv(compose(map(transformToCsvRow), sortRows(sortParams), map(transformToRow))(data), 'curators');

export const useCuratorsCsv = (sortParams: SortParams<CuratorsRowLite>) => {
  const { data: networkData } = useGraphNetwork();

  const { data, isFetching, refetch } = useQuery(
    ['all-curators'],
    async () => {
      if (!networkData) {
        return Promise.reject(new Error('Curators request cannot be sent without curators count.'));
      }

      const curators = await fetchAllParallel(
        networkData.curatorCount - DISCARDED_CURATORS_COUNT,
        getCurators,
      );

      return curators;
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

type CuratorsSearchResponse = {
  curators: Array<{ id: string }>;
};

export const useCuratorsSearch = (searchTerm: string) => {
  return useQuery(
    ['curators-search', searchTerm],
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

      return curators.map(({ id }) => id);
    },
    { enabled: isTermLongEnough(searchTerm) },
  );
};
