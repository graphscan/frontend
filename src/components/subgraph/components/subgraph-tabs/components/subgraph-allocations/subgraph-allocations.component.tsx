import { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  SubgraphAllocationsRow,
  columnsWidth,
  createColumns,
  createTransformerToRow,
} from './subgraph-allocations.model';
import {
  useSubgraphAllocations,
  useSubgraphAllocationsCount,
  useSubgraphAllocationsCsv,
} from './subgraph-allocations.service';
import { Empty } from '../../../../../common/empty/empty.component';
import { TabPreloader } from '../../../../../common/tab-preloader/tab-preloader.component';
import { Table } from '../../../../../common/table/table.component';
import { TableViewModel } from '../../../../../../model/table.model';
import { useGraphNetwork } from '../../../../../../services/graph-network.service';
import { useAllocationsRewards } from '../../../../../../utils/allocation-rewards.utils';

type Props = {
  id: string;
};

export const SubgraphAllocations: React.FC<Props> = observer(({ id }) => {
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
    new TableViewModel<SubgraphAllocationsRow>(
      'subgraph-allocations',
      {
        orderBy: 'allocatedTokens',
        orderDirection: 'desc',
      },
      id,
    ),
  );

  const { data: graphNetwork } = useGraphNetwork();

  const { allocationsRewards, renderRewardsButton } = useAllocationsRewards();

  const { data: subgraphAllocations, error, isFetching, isLoading } = useSubgraphAllocations({
    id,
    currentPage,
    perPage,
    sortParams,
  });

  const { data: count } = useSubgraphAllocationsCount(id);

  const rows = useMemo(
    () =>
      graphNetwork && subgraphAllocations
        ? subgraphAllocations.map(
            createTransformerToRow({ allocationsRewards, currentEpoch: graphNetwork.currentEpoch }),
          )
        : [],
    [allocationsRewards, graphNetwork, subgraphAllocations],
  );

  const { isCsvLoading, handleCsvDownload } = useSubgraphAllocationsCsv(id, sortParams);

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
    <Table<SubgraphAllocationsRow>
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
        unsortableKeys: ['activeStateDuration', 'indexer'],
        setSortParams,
      }}
    />
  );
});
