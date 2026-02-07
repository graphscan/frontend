import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  IndexerDelegatorsRow,
  columnsWidth,
  columns,
} from "./indexer-delegators.model";
import {
  useIndexerDelegators,
  useIndexerDelegatorsCsv,
} from "./indexer-delegators.service";
import { Empty } from "../../../../../common/empty/empty.component";
import { TabPreloader } from "../../../../../common/tab-preloader/tab-preloader.component";
import { Table } from "../../../../../common/table/table.component";
import { TableViewModel } from "../../../../../../model/table.model";

type Props = {
  id: string;
};

export const IndexerDelegators: React.FC<Props> = observer(({ id }) => {
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
    () =>
      new TableViewModel<IndexerDelegatorsRow>(
        "indexer-delegators",
        {
          orderBy: "stakedTokens",
          orderDirection: "desc",
        },
        id,
      ),
  );

  const {
    data: indexerDelegators,
    total: indexerDelegatorsTotal,
    error,
    isFetching,
    isLoading,
  } = useIndexerDelegators({
    id,
    currentPage,
    perPage,
    sortParams,
  });

  const rows = useMemo(() => indexerDelegators ?? [], [indexerDelegators]);

  const { isCsvLoading, handleCsvDownload } = useIndexerDelegatorsCsv(
    id,
    sortParams,
  );

  useEffect(() => {
    if (indexerDelegatorsTotal !== undefined) {
      setTotal(indexerDelegatorsTotal);
    }
  }, [setTotal, indexerDelegatorsTotal]);

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
    <Table<IndexerDelegatorsRow>
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
        setSortParams,
        unsortableKeys: ["unreleasedReward", "unreleasedRewardsPercent"],
      }}
    />
  );
});
