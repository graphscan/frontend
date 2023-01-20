import { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { compose, prop, tap, map } from 'ramda';
import {
  IndexersRow,
  columnsWidth,
  createColumns,
  transformToRows,
  transformToCsvRow,
} from './indexers.model';
import { useIndexers } from './indexers.service';
import { Empty } from '../../../../../common/empty/empty.component';
import { TabPreloader } from '../../../../../common/tab-preloader/tab-preloader.component';
import { Table } from '../../../../../common/table/table.component';
import { TableViewModel } from '../../../../../../model/table.model';
import { downloadCsv } from '../../../../../../utils/csv.utils';
import { useFavouriteColumn } from '../../../../../../utils/favourite-column.utils';

type Props = {
  plannedDelegation: string;
  plannedIndexerCut: string;
  plannedPeriod: string;
  searchTerm: string;
};

export const Indexers: React.FC<Props> = observer(
  ({ plannedDelegation, plannedIndexerCut, plannedPeriod, searchTerm }) => {
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
      new TableViewModel<IndexersRow>('indexers', {
        orderBy: 'allocatedTokens',
        orderDirection: 'desc',
      }),
    );

    const { data, error, isLoading, isRefetching } = useIndexers(plannedPeriod);

    const { favourites, sortFavouriteRows, columns } = useFavouriteColumn({
      defaultFavourites: {},
      initialColumns: createColumns(plannedPeriod),
      favouriteStorageKey: 'indexers-favourites',
    });

    const rows = useMemo(
      () =>
        data
          ? compose(
              (xs: Array<IndexersRow>) => xs.slice(perPage * (currentPage - 1), perPage * currentPage),
              sortFavouriteRows(sortParams),
              tap(compose(setTotal, prop('length'))),
              (xs) => {
                const currentLength = xs.length;
                const filtered = xs.filter(
                  (x) => x.id.match(RegExp(searchTerm, 'i')) || x.name?.match(RegExp(searchTerm, 'i')),
                );

                if (currentPage !== 1 && currentLength !== filtered.length) {
                  setCurrentPage(1);
                }

                return filtered;
              },
              transformToRows({
                plannedDelegation,
                plannedPeriod,
                plannedIndexerCut,
                favourites,
              }),
            )(data)
          : [],
      [
        currentPage,
        data,
        favourites,
        perPage,
        plannedDelegation,
        plannedIndexerCut,
        plannedPeriod,
        searchTerm,
        setCurrentPage,
        setTotal,
        sortFavouriteRows,
        sortParams,
      ],
    );

    const handleCsvDownload = useCallback(() => {
      if (data) {
        downloadCsv(
          compose(
            map(transformToCsvRow),
            sortFavouriteRows(sortParams),
            transformToRows({
              plannedDelegation,
              plannedPeriod,
              plannedIndexerCut,
              favourites,
            }),
          )(data),
          'indexers',
        );
      }
    }, [
      data,
      favourites,
      plannedDelegation,
      plannedIndexerCut,
      plannedPeriod,
      sortFavouriteRows,
      sortParams,
    ]);

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
      <Table<IndexersRow>
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
