import { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { compose } from 'ramda';
import {
  CuratorSubgraphsRowLite,
  columnsWidth,
  columns,
  transformToCsvRow,
} from './curator-subgraphs-lite.model';
import { useCuratorSubgraphs } from './curator-subgraphs-lite.service';
import { Empty } from '../../../../../common/empty/empty.component';
import { TabPreloader } from '../../../../../common/tab-preloader/tab-preloader.component';
import { Table } from '../../../../../common/table/table.component';
import { TableViewModel } from '../../../../../../model/table.model';
import { downloadCsv } from '../../../../../../utils/csv.utils';
import { sortRows } from '../../../../../../utils/table.utils';

type Props = {
  id: string;
};

export const CuratorSubgraphsLite: React.FC<Props> = observer(({ id }) => {
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
    new TableViewModel<CuratorSubgraphsRowLite>(
      'curator-subgraphs-lite',
      {
        orderBy: 'shares',
        orderDirection: 'asc',
      },
      id,
    ),
  );

  const { data, error, isFetching, isLoading } = useCuratorSubgraphs(id);

  useEffect(() => {
    if (data) {
      setTotal(data.length);
    }
  }, [data, setTotal]);

  const rows = useMemo(
    () =>
      data
        ? compose(
            (xs: Array<CuratorSubgraphsRowLite>) =>
              xs.slice(perPage * (currentPage - 1), perPage * currentPage),
            sortRows(sortParams),
          )(data)
        : [],
    [currentPage, data, perPage, sortParams],
  );

  const handleCsvDownload = useCallback(() => {
    if (data) {
      downloadCsv(sortRows(sortParams)(data).map(transformToCsvRow), 'curator-subgraphs');
    }
  }, [data, sortParams]);

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
    <Table<CuratorSubgraphsRowLite>
      columns={columns}
      rows={rows}
      columnsWidth={columnsWidth}
      isUpdating={isFetching}
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
        setSortParams,
      }}
    />
  );
});
