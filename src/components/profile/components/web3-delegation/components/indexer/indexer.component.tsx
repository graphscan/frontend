import { useEthers } from '@usedapp/core';
import { DelegationForm } from '../delegation-form/delegation-form.component';
import { SectionProps } from '../../web3-delegation.model';
import { useIndexerDelegationData } from './indexer.service';
import { renderDelegationData, renderEstimatedApr } from './indexer.utils';
import {
  Account,
  Userpick,
  Heading,
  HeadingText,
  Clarification,
  Stats,
  Row,
  Key,
} from '../../web3-delegation.styled';
import { AccountButtons } from '../../../../../common/account-buttons/account-buttons.component';
import { RobohashImage } from '../../../../../common/robohash-image/robohash-image.component';
import { clampMiddle } from '../../../../../../utils/text.utils';

type Props = SectionProps & {
  indexerId: string;
};

export const Indexer: React.FC<Props> = ({
  amount,
  delegated,
  indexerId,
  status,
  transaction,
  onSubmit,
  setAmount,
}) => {
  const response = useIndexerDelegationData(indexerId);
  const { active } = useEthers();

  return (
    <>
      <Account>
        <Userpick>
          <RobohashImage size={60} accountId={indexerId} />
        </Userpick>
        <section>
          <Heading>
            <HeadingText>{clampMiddle(indexerId)}</HeadingText>
            <AccountButtons id={indexerId} />
          </Heading>
          <Clarification>(Indexer)</Clarification>
        </section>
      </Account>
      {transaction === 'undelegate' && active && (
        <DelegationForm
          amount={amount}
          delegated={delegated}
          maxGrt={delegated}
          status={status}
          transaction={transaction}
          onSubmit={onSubmit}
          setAmount={setAmount}
        />
      )}
      <Stats>
        <Row>
          <Key>Effective Indexing Reward Cut</Key>
          {renderDelegationData(response, 'effectiveIndexingRewardFeeCut', true)}
        </Row>
        <Row>
          <Key>Effective Query Fee Cut</Key>
          {renderDelegationData(response, 'effectiveQueryFeeCut', true)}
        </Row>
        <Row>
          <Key>Estimated APR</Key>
          {renderEstimatedApr(response, amount)}
        </Row>
      </Stats>
      <Stats>
        <Row>
          <Key>Delegation Received</Key>
          {renderDelegationData(response, 'delegationPool')}
        </Row>
        <Row>
          <Key>Remain for Delegation</Key>
          {renderDelegationData(response, 'maxCapacity')}
        </Row>
      </Stats>
    </>
  );
};
