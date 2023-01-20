import { useEffect, useMemo, useState } from 'react';
import {
  DelegatorDelegationsRowLite,
  createDelegatorDelegationsColumns,
  columnsWidth,
} from './delegator-delegations-lite.model';
import {
  useDelegatorDelegations,
  useDelegatorDelegationsCount,
  useDelegatorDelegationsCsv,
} from './delegator-delegations-lite.service';
import { useDelegationTransactions } from './delegator-delegations-lite.utils';
import { Web3Delegation } from '../../../web3-delegation/web3-delegation.component';
import { Empty } from '../../../../../common/empty/empty.component';
import { Modal } from '../../../../../common/modal/modal.component';
import { Table } from '../../../../../common/table/table.component';
import { TabPreloader } from '../../../../../common/tab-preloader/tab-preloader.component';
import { connectionViewModel } from '../../../../../../model/connection.model';
import { TableViewModel } from '../../../../../../model/table.model';
import { capitalize } from '../../../../../../utils/text.utils';
import { observer } from 'mobx-react-lite';

type Props = {
  id: string;
};

export const DelegatorDelegationsLite: React.FC<Props> = observer(({ id }) => {
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
    new TableViewModel<DelegatorDelegationsRowLite>(
      'delegator-delegations-lite',
      {
        orderBy: 'id',
        orderDirection: 'desc',
      },
      id,
    ),
  );

  const { currentAddress } = connectionViewModel;

  const { data: delegatorDelegationsRows, error, isFetching, isLoading } = useDelegatorDelegations({
    id,
    currentPage,
    perPage,
    sortParams,
  });

  const { data: count } = useDelegatorDelegationsCount(id);

  const rows = useMemo(() => delegatorDelegationsRows ?? [], [delegatorDelegationsRows]);

  const { isCsvLoading, handleCsvDownload } = useDelegatorDelegationsCsv(id, sortParams);

  useEffect(() => {
    if (count) {
      setTotal(count);
    }
  }, [setTotal, count]);

  const {
    showModal,
    transaction,
    currentIndexerId,
    toggleModal,
    createTransactionButtonRenderer,
  } = useDelegationTransactions(id, currentAddress);

  const columns = useMemo(() => createDelegatorDelegationsColumns(createTransactionButtonRenderer), [
    createTransactionButtonRenderer,
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
    <>
      <Table<DelegatorDelegationsRowLite>
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
          unsortableKeys: ['currentDelegationAmount', 'sharesRate', 'delegate', 'undelegate', 'withdraw'],
          setSortParams,
        }}
      />
      <Modal
        title={typeof transaction === 'string' ? capitalize(transaction) : undefined}
        isVisible={showModal}
        onCancel={toggleModal}
      >
        {typeof transaction === 'string' && currentIndexerId !== null && (
          <Web3Delegation indexerId={currentIndexerId} transaction={transaction} />
        )}
      </Modal>
    </>
  );
});
