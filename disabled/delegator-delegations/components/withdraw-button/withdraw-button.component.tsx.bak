import { useEthers } from "@usedapp/core";
import { Withdraw } from "./withdraw-button.icons";
import { useEpochData, useWithdraw } from "./withdraw-button.service";
import {
  DelegatorDelegationsButton,
  DelegatorDelegationsSpinnerContainer,
} from "../../delegator-delegations.styled";
import { Spinner } from "../../../../../../../common/spinner/spinner.component";
import { dhm } from "../../../../../../../../utils/date.utils";
import { preventDefault } from "../../../../../../../../utils/events.utils";
import { formatTableDate } from "../../../../../../../../utils/table.utils";

const Loader: React.FC = () => (
  <DelegatorDelegationsSpinnerContainer>
    <Spinner />
  </DelegatorDelegationsSpinnerContainer>
);

type Props = {
  indexerId: string;
  lockedTokens: number;
  lockedUntil: number;
  delegatorId: string;
  currentAddress: string | null;
};

export const WithdrawButton: React.FC<Props> = ({
  indexerId,
  lockedTokens,
  lockedUntil,
  delegatorId,
  currentAddress,
}) => {
  const { data, error, isLoading } = useEpochData();

  const { mutate: withdraw, isLoading: isWithdrawing } = useWithdraw(
    indexerId,
    currentAddress,
  );

  const { account } = useEthers();

  const isCurrentDelegator =
    delegatorId === currentAddress || delegatorId === account?.toLowerCase();

  const handleClick = () => withdraw();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  if (!data) {
    return null;
  }

  const { currentEpoch, epochLength, currentEpochEndBlock, currentBlock } =
    data;

  const secondsRemainingUntilWithdraw =
    ((lockedUntil - currentEpoch) * epochLength -
      (currentBlock - currentEpochEndBlock + epochLength)) *
    12.08; /** TODO check eth mainnet avg block time. Last update 29 nov 2023 = 12.08 */

  return isWithdrawing ? (
    <Loader />
  ) : lockedUntil > 0 && currentEpoch < lockedUntil ? (
    <span
      className="ant-table-cell-monospaced-value"
      data-tip={`~ ${formatTableDate(Date.now() / 1000 + secondsRemainingUntilWithdraw)}`}
    >
      ~ {dhm(secondsRemainingUntilWithdraw * 1000)}
    </span>
  ) : (
    <DelegatorDelegationsButton
      data-html
      data-tip={
        isCurrentDelegator && lockedTokens > 0
          ? `
              <div style="text-align: center; color: #859EC3;">
                Available to withdraw
                <br/><b style="color: #fff;">${lockedTokens}</b> GRT
              </div>
            `
          : null
      }
      disabled={
        !(
          lockedTokens > 0 &&
          lockedUntil > 0 &&
          isCurrentDelegator &&
          currentEpoch >= lockedUntil
        )
      }
      onClick={handleClick}
      onMouseDown={preventDefault}
    >
      <Withdraw />
    </DelegatorDelegationsButton>
  );
};
