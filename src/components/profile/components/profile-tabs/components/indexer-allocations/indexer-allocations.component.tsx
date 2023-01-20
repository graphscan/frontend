import { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  IndexerAllocationsRow,
  columnsWidth,
  createColumns,
  createTransformerToRow,
} from './indexer-allocations.model';
import {
  useIndexerAllocations,
  useIndexerAllocationsCount,
  useIndexerAllocationsCsv,
} from './indexer-allocations.service';
import { Empty } from '../../../../../common/empty/empty.component';
import { TabPreloader } from '../../../../../common/tab-preloader/tab-preloader.component';
import { Table } from '../../../../../common/table/table.component';
import { TableViewModel } from '../../../../../../model/table.model';
import { useGraphNetwork } from '../../../../../../services/graph-network.service';
import { useAllocationsRewards } from '../../../../../../utils/allocation-rewards.utils';

type Props = {
  id: string;
  isLite: boolean;
};

export const IndexerAllocations: React.FC<Props> = observer(({ id, isLite }) => {
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
    new TableViewModel<IndexerAllocationsRow>(
      'indexer-allocations',
      {
        orderBy: 'createdAt',
        orderDirection: 'desc',
      },
      id,
    ),
  );

  const { data: graphNetwork } = useGraphNetwork();

  const { allocationsRewards, renderRewardsButton } = useAllocationsRewards();

  const { data: indexerAllocations, error, isFetching, isLoading } = useIndexerAllocations({
    id,
    currentPage,
    perPage,
    sortParams,
  });

  const { data: count } = useIndexerAllocationsCount(id);

  const rows = useMemo(
    () =>
      graphNetwork && indexerAllocations
        ? indexerAllocations.map(
            createTransformerToRow({ allocationsRewards, currentEpoch: graphNetwork.currentEpoch }),
          )
        : [],
    [allocationsRewards, graphNetwork, indexerAllocations],
  );

  const { isCsvLoading, handleCsvDownload } = useIndexerAllocationsCsv(id, sortParams);

  useEffect(() => {
    if (count) {
      setTotal(count);
    }
  }, [setTotal, count]);

  const columns = useMemo(() => createColumns(renderRewardsButton), [renderRewardsButton]);

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
    <Table<IndexerAllocationsRow>
      columns={columns}
      rows={rows}
      columnsWidth={columnsWidth}
      isUpdating={isFetching}
      downloadCsvOptions={{
        isLoading: isCsvLoading,
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
        unsortableKeys: [
          'image',
          'subgraphName',
          'subgraphProportion',
          'subgraphDeploymentId',
          'activeStateDuration',
          ...(isLite ? ['statusInt'] : []),
        ],
        setSortParams,
      }}
    />
  );
});
