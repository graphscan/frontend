import { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { compose, prop, tap, map } from 'ramda';
import {
  SubgraphsRow,
  columnsWidth,
  columns as initialColumns,
  transformToRows,
  transformToCsvRow,
} from './subgraphs.model';
import { useSubgraphs } from './subgraphs.service';
import { Empty } from '../../../../../common/empty/empty.component';
import { TabPreloader } from '../../../../../common/tab-preloader/tab-preloader.component';
import { Table } from '../../../../../common/table/table.component';
import { bs58encode } from '../../../../../../utils/bs58.utils';
import { downloadCsv } from '../../../../../../utils/csv.utils';
import { useFavouriteColumn } from '../../../../../../utils/favourite-column.utils';
import { TableViewModel } from '../../../../../../model/table.model';

type Props = {
  searchTerm: string;
};

export const Subgraphs: React.FC<Props> = observer(({ searchTerm }) => {
  const [
    {
      currentPage,
      perPage,
      perPageOptions,
      sortParams,
      total,
      storageManager,
      setCurrentPage,
      setPerPage,
      setSortParams,
      setTotal,
    },
  ] = useState(
    new TableViewModel<SubgraphsRow>('subgraphs', {
      orderBy: 'displayName',
      orderDirection: 'asc',
    }),
  );

  const { data, error, isLoading, isRefetching } = useSubgraphs();

  const { favourites, sortFavouriteRows, columns } = useFavouriteColumn({
    initialColumns,
    favouriteStorageKey: 'subgraphs-favourites',
  });

  const rows = useMemo(
    () =>
      data
        ? compose(
            (xs: Array<SubgraphsRow>) => xs.slice(perPage * (currentPage - 1), perPage * currentPage),
            sortFavouriteRows(sortParams),
            tap(compose(setTotal, prop('length'))),
            (xs: Array<SubgraphsRow>) => {
              const currentLength = xs.length;
              const filtered = xs.filter(
                (x) =>
                  x.id.match(RegExp(searchTerm, 'i')) ||
                  x.deploymentId.match(RegExp(searchTerm, 'i')) ||
                  x.displayName.match(RegExp(searchTerm, 'i')) ||
                  bs58encode(`1220${x.deploymentId.substring(2)}`).match(RegExp(searchTerm, 'i')),
              );

              if (currentPage !== 1 && currentLength !== filtered.length) {
                setCurrentPage(1);
              }

              return filtered;
            },
            transformToRows(favourites),
          )(data)
        : [],
    [
      currentPage,
      data,
      favourites,
      searchTerm,
      perPage,
      setCurrentPage,
      setTotal,
      sortFavouriteRows,
      sortParams,
    ],
  );

  const handleCsvDownload = useCallback(() => {
    if (data) {
      downloadCsv(
        compose(map(transformToCsvRow), sortFavouriteRows(sortParams), transformToRows(favourites))(data),
        'subgraphs',
      );
    }
  }, [data, favourites, sortFavouriteRows, sortParams]);

  if (isLoading) {
    return <TabPreloader />;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    storageManager.setStoragePerPage(null);
    storageManager.setStorageSortParams(null);
    return <Empty />;
  }

  return (
    <Table<SubgraphsRow>
      columns={columns}
      rows={rows}
      columnsWidth={columnsWidth}
      isUpdating={isRefetching}
      downloadCsvOptions={{
        onDownload: handleCsvDownload,
        isLoading: isRefetching,
      }}
      paginationOptions={{
        currentPage,
        perPage,
        perPageOptions,
        total,
        setCurrentPage,
        setPerPage,
      }}
      sortingOptions={{
        sortParams,
        unsortableKeys: ['favourite'],
        setSortParams,
      }}
    />
  );
});
