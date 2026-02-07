import { useEthers } from "@usedapp/core";
import { Delegate, Undelegate } from "./delegation-button.icons";
import { DelegatorDelegationsButton } from "../../delegator-delegations.styled";
import { DelegationTransactionWithUI } from "../../../../../../../../model/web3-transactions.model";
import { preventDefault } from "../../../../../../../../utils/events.utils";

type Props = {
  transaction: DelegationTransactionWithUI;
  indexerId: string;
  onClick: (
    transaction: DelegationTransactionWithUI,
    indexerId: string,
  ) => () => void;
};

export const DelegationButton: React.FC<Props> = ({
  transaction,
  indexerId,
  onClick,
}) => {
  const { active } = useEthers();
  const isDelegation = transaction === "delegate";
  const isUndelegation = transaction === "undelegate";

  return (
    <DelegatorDelegationsButton
      disabled={isUndelegation && !active}
      onClick={onClick(isDelegation ? "delegate" : "undelegate", indexerId)}
      onMouseDown={preventDefault}
    >
      {isDelegation ? <Delegate /> : <Undelegate />}
    </DelegatorDelegationsButton>
  );
};
