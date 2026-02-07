import { createElement, useCallback, useState } from "react";
import { DelegatorDelegationsRow } from "./delegator-delegations.model";
import { DelegationButton } from "./components/delegation-button/delegation-button.component";
import { WithdrawButton } from "./components/withdraw-button/withdraw-button.component";
import {
  DelegationTransaction,
  DelegationTransactionWithUI,
} from "../../../../../../model/web3-transactions.model";

export const useDelegationTransactions = (
  id: string,
  currentAddress: string | null,
) => {
  const [showModal, setShowModal] = useState(false);
  const [transaction, setTransaction] =
    useState<DelegationTransactionWithUI | null>(null);
  const [currentIndexerId, setCurrentIndexerId] = useState<string | null>(null);

  const toggleModal = useCallback(() => {
    setShowModal((prevState) => {
      if (prevState) {
        setTransaction(null);
      }

      return !prevState;
    });
  }, []);

  const handleDelegationButtonClick = useCallback(
    (transaction: DelegationTransactionWithUI, indexerId: string) => () => {
      toggleModal();
      setTransaction(transaction);
      setCurrentIndexerId(indexerId);
    },
    [toggleModal],
  );

  const createTransactionButtonRenderer = useCallback(
    (transaction: DelegationTransaction) =>
      (_: undefined, row: DelegatorDelegationsRow) => {
        const { id: indexerId, lockedTokens, lockedUntil } = row;

        return transaction === "withdraw"
          ? createElement(WithdrawButton, {
              delegatorId: id,
              currentAddress,
              indexerId,
              lockedTokens,
              lockedUntil,
            })
          : createElement(DelegationButton, {
              transaction,
              indexerId,
              onClick: handleDelegationButtonClick,
            });
      },
    [currentAddress, handleDelegationButtonClick, id],
  );

  return {
    showModal,
    transaction,
    currentIndexerId,
    toggleModal,
    createTransactionButtonRenderer,
  };
};
