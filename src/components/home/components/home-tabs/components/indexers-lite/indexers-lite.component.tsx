import { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { compose, prop, tap, map } from 'ramda';
import {
  IndexersRowLite,
  columnsWidth,
  columns as initialColumns,
  transformToCsvRow,
} from './indexers-lite.model';
import { useIndexers } from './indexers-lite.service';
import { Empty } from '../../../../../common/empty/empty.component';
import { TabPreloader } from '../../../../../common/tab-preloader/tab-preloader.component';
import { Table } from '../../../../../common/table/table.component';
import { downloadCsv } from '../../../../../../utils/csv.utils';
import { useFavouriteColumn } from '../../../../../../utils/favourite-column.utils';
import { TableViewModel } from '../../../../../../model/table.model';

type Props = {
  plannedDelegation: string;
  plannedIndexerCut: string;
  searchTerm: string;
};

export const IndexersLite: React.FC<Props> = observer(
  ({ plannedDelegation, plannedIndexerCut, searchTerm }) => {
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
      new TableViewModel<IndexersRowLite>('indexers-lite', {
        orderBy: 'allocatedTokens',
        orderDirection: 'desc',
      }),
    );

    const { favourites, sortFavouriteRows, columns } = useFavouriteColumn({
      defaultFavourites: {},
      initialColumns,
      favouriteStorageKey: 'indexers-favourites',
    });

    const { data, error, isLoading, isRefetching } = useIndexers({
      plannedDelegation,
      plannedIndexerCut,
      favourites,
    });

    const rows = useMemo(
      () =>
        compose(
          (rows: Array<IndexersRowLite>) => rows.slice(perPage * (currentPage - 1), perPage * currentPage),
          sortFavouriteRows(sortParams),
          tap(compose(setTotal, prop('length'))),
          (rows: Array<IndexersRowLite>) => {
            const currentLength = rows.length;
            const filtered = rows.filter(
              (row) => row.id.match(RegExp(searchTerm, 'i')) || row.name?.match(RegExp(searchTerm, 'i')),
            );

            if (currentPage !== 1 && currentLength !== filtered.length) {
              setCurrentPage(1);
            }

            return filtered;
          },
        )(data),
      [currentPage, data, perPage, searchTerm, setCurrentPage, setTotal, sortFavouriteRows, sortParams],
    );

    const handleCsvDownload = useCallback(() => {
      downloadCsv(compose(map(transformToCsvRow), sortFavouriteRows(sortParams))(data), 'indexers');
    }, [data, sortFavouriteRows, sortParams]);

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
      <Table<IndexersRowLite>
        columns={columns}
        rows={rows}
        columnsWidth={columnsWidth}
        isUpdating={isRefetching}
        downloadCsvOptions={{
          onDownload: handleCsvDownload,
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
  },
);
