import { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { compose, map } from 'ramda';
import {
  SubgraphAllocationsRowLite,
  columnsWidth,
  createColumns,
  createTransformerToRow,
  transformToCsvRow,
} from './subgraph-allocations-lite.model';
import { useSubgraphAllocations } from './subgraph-allocations-lite.service';
import { Empty } from '../../../../../common/empty/empty.component';
import { TabPreloader } from '../../../../../common/tab-preloader/tab-preloader.component';
import { Table } from '../../../../../common/table/table.component';
import { TableViewModel } from '../../../../../../model/table.model';
import { useGraphNetwork } from '../../../../../../services/graph-network.service';
import { useAllocationsRewards } from '../../../../../../utils/allocation-rewards.utils';
import { downloadCsv } from '../../../../../../utils/csv.utils';
import { sortRows } from '../../../../../../utils/table.utils';

type Props = {
  id: string;
};

export const SubgraphAllocationsLite: React.FC<Props> = observer(({ id }) => {
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
    new TableViewModel<SubgraphAllocationsRowLite>(
      'subgraph-allocations-lite',
      {
        orderBy: 'allocatedTokens',
        orderDirection: 'desc',
      },
      id,
    ),
  );

  const { data: graphNetwork } = useGraphNetwork();

  const { allocationsRewards, renderRewardsButton } = useAllocationsRewards();

  const { data, error, isFetching, isLoading } = useSubgraphAllocations(id);

  useEffect(() => {
    if (data) {
      setTotal(data.length);
    }
  }, [data, setTotal]);

  const columns = useMemo(() => createColumns(renderRewardsButton), [renderRewardsButton]);

  const rows = useMemo(
    () =>
      data && graphNetwork
        ? compose(
            (xs: Array<SubgraphAllocationsRowLite>) =>
              xs.slice(perPage * (currentPage - 1), perPage * currentPage),
            sortRows(sortParams),
            map(createTransformerToRow({ allocationsRewards, currentEpoch: graphNetwork.currentEpoch })),
          )(data)
        : [],
    [allocationsRewards, currentPage, data, graphNetwork, perPage, sortParams],
  );

  const handleCsvDownload = useCallback(() => {
    if (data) {
      downloadCsv(
        compose(map(transformToCsvRow), sortRows(sortParams), map(createTransformerToRow()))(data),
        'subgraph-allocations',
      );
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
    <Table<SubgraphAllocationsRowLite>
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
