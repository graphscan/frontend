import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  DelegatorDelegationsRow,
  createDelegatorDelegationsColumns,
  columnsWidth,
} from "./delegator-delegations.model";
import {
  useDelegatorDelegations,
  useDelegatorDelegationsCsv,
} from "./delegator-delegations.service";
// import { useDelegationTransactions } from "./delegator-delegations.utils";
// import { Web3Delegation } from '../../../web3-delegation.disabled/web3-delegation.component';
import { Empty } from "../../../../../common/empty/empty.component";
import { Modal } from "../../../../../common/modal/modal.component";
import { Table } from "../../../../../common/table/table.component";
import { TabPreloader } from "../../../../../common/tab-preloader/tab-preloader.component";
import { connectionViewModel } from "../../../../../../model/connection.model";
import { TableViewModel } from "../../../../../../model/table.model";
import { useEnsAccounts } from "../../../../../../services/ens.service";
import { capitalize } from "../../../../../../utils/text.utils";

type Props = {
  id: string;
};

export const DelegatorDelegations: React.FC<Props> = observer(({ id }) => {
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
      new TableViewModel<DelegatorDelegationsRow>(
        "delegator-delegations",
        {
          orderBy: "id",
          orderDirection: "desc",
        },
        id,
      ),
  );

  const { currentAddress } = connectionViewModel;

  const {
    data: delegatorDelegationsRows,
    total: delegatorDelegationsTotal,
    error,
    isFetching,
    isLoading,
  } = useDelegatorDelegations({
    id,
    currentPage,
    perPage,
    sortParams,
  });

  const { data: ens } = useEnsAccounts(
    delegatorDelegationsRows?.filter(({ name }) => !name).map(({ id }) => id),
  );

  const rows = useMemo(() => {
    if (delegatorDelegationsRows && ens) {
      return delegatorDelegationsRows.map((row) => {
        const { id } = row;

        if (id in ens) {
          const newRow = { ...row };
          newRow.name = ens[id];

          return newRow;
        }

        return row;
      });
    }

    return delegatorDelegationsRows ?? [];
  }, [delegatorDelegationsRows, ens]);

  const { isCsvLoading, handleCsvDownload } = useDelegatorDelegationsCsv(
    id,
    sortParams,
  );

  useEffect(() => {
    if (delegatorDelegationsTotal !== undefined) {
      setTotal(delegatorDelegationsTotal);
    }
  }, [setTotal, delegatorDelegationsTotal]);

  const columns = createDelegatorDelegationsColumns();

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
    <>
      <Table<DelegatorDelegationsRow>
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
            "unreleasedReward",
            "unreleasedRewardsPercent",
            "delegate",
            "undelegate",
            "withdraw",
          ],
          setSortParams,
        }}
      />
      {/* <Modal
        title={typeof transaction === 'string' ? capitalize(transaction) : undefined}
        isVisible={showModal}
        onCancel={toggleModal}
      >
        {typeof transaction === 'string' && currentIndexerId !== null && (
          <Web3Delegation indexerId={currentIndexerId} transaction={transaction} />
        )}
      </Modal> */}
    </>
  );
});
