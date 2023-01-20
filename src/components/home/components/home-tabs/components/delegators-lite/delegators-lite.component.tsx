import { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { DelegatorsRowLite, columnsWidth, columns } from './delegators-lite.model';
import { useDelegators, useDelegatorsSearch, useDelegatorsCsv } from './delegators-lite.service';
import { Empty } from '../../../../../common/empty/empty.component';
import { TabPreloader } from '../../../../../common/tab-preloader/tab-preloader.component';
import { Table } from '../../../../../common/table/table.component';
import { useGraphNetwork } from '../../../../../../services/graph-network.service';
import { TableViewModel } from '../../../../../../model/table.model';

type Props = {
  searchTerm: string;
};

export const DelegatorsLite: React.FC<Props> = observer(({ searchTerm }) => {
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
    new TableViewModel<DelegatorsRowLite>('delegators-lite', {
      orderBy: 'id',
      orderDirection: 'desc',
    }),
  );

  const { data: delegators, error, isFetching, isLoading } = useDelegators({
    currentPage,
    perPage,
    sortParams,
    idFilters,
  });

  const { data: searchedDelegatorsIds, isFetching: isSearching } = useDelegatorsSearch(searchTerm);

  const { data: networkData } = useGraphNetwork();

  const { isCsvLoading, handleCsvDownload } = useDelegatorsCsv(sortParams);

  const rows = useMemo(() => delegators ?? [], [delegators]);

  useEffect(() => {
    if (searchedDelegatorsIds?.length) {
      if (String(idFilters) !== String(searchedDelegatorsIds)) {
        setIdFilters(searchedDelegatorsIds);
        setTotal(searchedDelegatorsIds.length);
        setCurrentPage(1);
      }
    } else if (networkData && !isSearching) {
      setTotal(networkData.delegatorCount);
      if (idFilters) {
        setIdFilters(null);
      }
    }
  }, [idFilters, isSearching, networkData, searchedDelegatorsIds, setCurrentPage, setIdFilters, setTotal]);

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
    <Table<DelegatorsRowLite>
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
        unsortableKeys: ['lastDelegationAt', 'lastUnDelegationAt'],
        setSortParams,
      }}
    />
  );
});
