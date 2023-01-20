import { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useQueryClient } from '@tanstack/react-query';
import { useEthers } from '@usedapp/core';
import { Web3DelegationViewModel } from './web3-delegation.model';
import { INDEXER_DELEGATION_DATA_CACHE_KEY, useDelegations } from './web3-delegation.service';
import { Container, Section, To } from './web3-delegation.styled';
import { Connect } from './components/connect/connect.component';
import { Indexer } from './components/indexer/indexer.component';
import { Delegator } from './components/delegator/delegator.component';
import { DelegationTransactionWithUI } from '../../../../model/web3-transations.model';
import { DELEGATOR_DELEGATIONS_CACHE_KEY } from '../../../../services/delegator-delegations.service';
import { INDEXER_DELEGATORS_CACHE_KEY } from '../../../../services/indexer-delegators.service';

type Props = {
  indexerId: string;
  transaction: DelegationTransactionWithUI;
};

export const Web3Delegation: React.FC<Props> = observer(({ indexerId, transaction }) => {
  const [
    {
      amount,
      currentAddress,
      status,
      delegate,
      delegateLocked,
      setAmount,
      setStatus,
      undelegate,
      undelegateLocked,
    },
  ] = useState(new Web3DelegationViewModel());
  const { account, active } = useEthers();

  const { data, refetch } = useDelegations(currentAddress ?? account?.toLowerCase(), indexerId);

  const delegatedToCurrentIndexer = data?.delegatedToCurrentIndexer ?? 0;

  const isDelegation = transaction === 'delegate';

  const client = useQueryClient();

  const confirm = useCallback(() => {
    setAmount('');
    setStatus(null);
    refetch();
    client.invalidateQueries([INDEXER_DELEGATION_DATA_CACHE_KEY, indexerId.toLowerCase()]);
    client.invalidateQueries([DELEGATOR_DELEGATIONS_CACHE_KEY, account?.toLowerCase()]);
    client.invalidateQueries([DELEGATOR_DELEGATIONS_CACHE_KEY, currentAddress?.toLowerCase()]);
    client.invalidateQueries([INDEXER_DELEGATORS_CACHE_KEY, indexerId.toLowerCase()]);
  }, [account, client, currentAddress, indexerId, refetch, setAmount, setStatus]);

  useEffect(
    () => () => {
      if (status) {
        confirm();
      }
    },
    [confirm, status],
  );

  const handleDelegate = useCallback(() => delegate(indexerId), [delegate, indexerId]);

  const handleDelegateLocked = useCallback(() => delegateLocked(indexerId), [indexerId, delegateLocked]);

  const handleUndelegate = useCallback(() => undelegate(indexerId, delegatedToCurrentIndexer), [
    delegatedToCurrentIndexer,
    indexerId,
    undelegate,
  ]);

  const handleUndelegateLocked = useCallback(() => undelegateLocked(indexerId, delegatedToCurrentIndexer), [
    delegatedToCurrentIndexer,
    indexerId,
    undelegateLocked,
  ]);

  const renderIndexer = useCallback(
    () => (
      <Indexer
        amount={amount}
        delegated={delegatedToCurrentIndexer}
        indexerId={indexerId}
        status={status}
        transaction={transaction}
        onSubmit={
          status === 'done'
            ? confirm
            : !currentAddress || currentAddress === String(account).toLowerCase()
            ? handleUndelegate
            : handleUndelegateLocked
        }
        setAmount={setAmount}
      />
    ),
    [
      account,
      amount,
      confirm,
      currentAddress,
      delegatedToCurrentIndexer,
      handleUndelegate,
      handleUndelegateLocked,
      indexerId,
      setAmount,
      status,
      transaction,
    ],
  );

  const renderDelegator = useCallback(
    () =>
      active && typeof account === 'string' ? (
        <Delegator
          amount={amount}
          delegatorId={currentAddress ?? account}
          delegated={delegatedToCurrentIndexer}
          delegatedTotal={data?.delegatedTotal}
          status={status}
          transaction={transaction}
          onSubmit={
            status === 'done'
              ? confirm
              : !currentAddress || currentAddress === account.toLowerCase()
              ? handleDelegate
              : handleDelegateLocked
          }
          setAmount={setAmount}
        />
      ) : (
        <Connect />
      ),
    [
      account,
      active,
      amount,
      confirm,
      currentAddress,
      data?.delegatedTotal,
      delegatedToCurrentIndexer,
      handleDelegate,
      handleDelegateLocked,
      setAmount,
      status,
      transaction,
    ],
  );

  return (
    <Container>
      <Section>{isDelegation ? renderDelegator() : renderIndexer()}</Section>
      <To active={active}>
        <img src="/images/direction-arrow.svg" alt="Pointer" />
      </To>
      <Section>{isDelegation ? renderIndexer() : renderDelegator()}</Section>
    </Container>
  );
});
