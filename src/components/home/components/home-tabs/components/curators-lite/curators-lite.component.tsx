import { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { CuratorsRowLite, columnsWidth, columns } from './curators-lite.model';
import { useCurators, useCuratorsSearch, useCuratorsCsv } from './curators-lite.service';
import { Empty } from '../../../../../common/empty/empty.component';
import { TabPreloader } from '../../../../../common/tab-preloader/tab-preloader.component';
import { DISCARDED_CURATORS_COUNT } from '../../../../../../model/curators.model';
import { Table } from '../../../../../common/table/table.component';
import { useGraphNetwork } from '../../../../../../services/graph-network.service';
import { TableViewModel } from '../../../../../../model/table.model';

type Props = {
  searchTerm: string;
};

export const CuratorsLite: React.FC<Props> = observer(({ searchTerm }) => {
  const [
    {
      currentPage,
      idFilters,
      perPage,
      perPageOptions,
      sortParams,
      total,
      storageManager,
      setCurrentPage,
      setIdFilters,
      setPerPage,
      setSortParams,
      setTotal,
    },
  ] = useState(
    new TableViewModel<CuratorsRowLite>('curators-lite', {
      orderBy: 'id',
      orderDirection: 'asc',
    }),
  );

  const { data: curators, error, isFetching, isLoading } = useCurators({
    currentPage,
    perPage,
    sortParams,
    idFilters,
  });

  const { data: searchedCuratorsIds, isFetching: isSearching } = useCuratorsSearch(searchTerm);

  const { data: networkData } = useGraphNetwork();

  const { isCsvLoading, handleCsvDownload } = useCuratorsCsv(sortParams);

  const rows = useMemo(() => curators ?? [], [curators]);

  useEffect(() => {
    if (searchedCuratorsIds?.length) {
      if (String(idFilters) !== String(searchedCuratorsIds)) {
        setIdFilters(searchedCuratorsIds);
        setTotal(searchedCuratorsIds.length);
        setCurrentPage(1);
      }
    } else if (networkData && !isSearching) {
      setTotal(networkData.curatorCount - DISCARDED_CURATORS_COUNT);
      if (idFilters) {
        setIdFilters(null);
      }
    }
  }, [idFilters, isSearching, networkData, searchedCuratorsIds, setCurrentPage, setIdFilters, setTotal]);

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
    <Table<CuratorsRowLite>
      columns={columns}
      rows={rows}
      columnsWidth={columnsWidth}
      isUpdating={isFetching}
      downloadCsvOptions={{
        onDownload: handleCsvDownload,
        isLoading: isCsvLoading,
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
