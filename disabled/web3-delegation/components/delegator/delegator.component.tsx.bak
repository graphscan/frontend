import { DelegationForm } from '../delegation-form/delegation-form.component';
import { Loader } from '../loader/loader.component';
import { SectionProps } from '../../web3-delegation.model';
import {
  Account,
  Userpick,
  Heading,
  HeadingText,
  Clarification,
  Stats,
  Row,
  Key,
  Value,
  Postfix,
} from '../../web3-delegation.styled';
import { AccountButtons } from '../../../../../common/account-buttons/account-buttons.component';
import { RobohashImage } from '../../../../../common/robohash-image/robohash-image.component';
import { formatNumber } from '../../../../../../utils/number.utils';
import { tooltipNumberContent } from '../../../../../../utils/tooltip.utils';
import { clampMiddle } from '../../../../../../utils/text.utils';
import { bigNumberToGRT, useGRTBalance } from '../../../../../../utils/web3.utils';

type Props = SectionProps & {
  delegatorId: string;
  delegatedTotal: number | undefined;
};

export const Delegator: React.FC<Props> = ({
  amount,
  delegatorId,
  delegated,
  delegatedTotal,
  status,
  transaction,
  onSubmit,
  setAmount,
}) => {
  const balanceBn = useGRTBalance(delegatorId);
  const balance = bigNumberToGRT(balanceBn);
  const delegatorIdUI = delegatorId.toLowerCase();

  return (
    <>
      <Account>
        <Userpick>
          <RobohashImage size={60} accountId={delegatorIdUI} />
        </Userpick>
        <section>
          <Heading>
            <HeadingText>{clampMiddle(delegatorIdUI)}</HeadingText>
            <AccountButtons id={delegatorIdUI} />
          </Heading>
          <Clarification>(You)</Clarification>
        </section>
      </Account>
      <Stats>
        <Row>
          <Key>In wallet</Key>
          <Value data-tip={tooltipNumberContent(balance)}>
            {formatNumber(balance)}
            <Postfix>GRT</Postfix>
          </Value>
        </Row>
        <Row>
          <Key>Your delegation</Key>
          {typeof delegatedTotal === 'number' ? (
            <Value data-tip={tooltipNumberContent(delegatedTotal)}>
              {formatNumber(delegatedTotal)}
              <Postfix>GRT</Postfix>
            </Value>
          ) : (
            <Value>
              <Loader />
            </Value>
          )}
        </Row>
      </Stats>
      {transaction === 'delegate' && (
        <DelegationForm
          amount={amount}
          delegated={delegated}
          maxGrt={balance}
          status={status}
          transaction={transaction}
          onSubmit={onSubmit}
          isIndexer={false}
          setAmount={setAmount}
        />
      )}
    </>
  );
};
