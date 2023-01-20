import { FormStatusRow, FormKey, FormInput, FormDescription, ButtonWrapper } from './delegation-form.styled';
import { Input } from '../input/input.component';
import { SectionProps } from '../../web3-delegation.model';
import { TransactionButton } from '../../../../../common/transaction-button/transaction-button.component';
import { formatNumber } from '../../../../../../utils/number.utils';

import { Value, Postfix } from '../../web3-delegation.styled';

type Props = SectionProps & {
  isIndexer?: boolean;
  maxGrt: number;
};

export const DelegationForm: React.FC<Props> = ({
  transaction,
  delegated,
  maxGrt,
  amount,
  status,
  setAmount,
  onSubmit,
  isIndexer = true,
}) => {
  const isDelegation = transaction === 'delegate';
  const loading = status === 'loading';
  const done = status === 'done';
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormStatusRow>
        <FormKey small={isDelegation}>
          You {isDelegation ? 'have already delegated' : 'are delegating'} to this indexer:&nbsp;
        </FormKey>
        <Value data-tip={delegated}>
          {delegated > 0 && !Number.isInteger(delegated) && '~'}&nbsp;
          {formatNumber(delegated)}
          <Postfix>GRT</Postfix>
        </Value>
      </FormStatusRow>
      <FormInput>
        <Input
          disabled={Boolean(status)}
          input={amount}
          setInput={setAmount}
          all={maxGrt}
          placeholder="GRT"
        />
      </FormInput>
      <FormDescription>
        {isDelegation
          ? `A 0.5% tax is charged upon delegation. Delegation commissions are automatically redelegate to
            the indexer tax-free. Delegated stake will be  withdrawn after ~28 days undelegation period.`
          : 'Delegated stake will be withdrawn after ~28 days undelegating period.'}
      </FormDescription>
      <ButtonWrapper indexer={isIndexer}>
        <TransactionButton
          status={status}
          direction={isDelegation ? 'to' : 'from'}
          disabled={amount.length < 1}
        >
          {loading ? 'Submitting' : done ? 'Success' : 'Submit Transation'}
        </TransactionButton>
      </ButtonWrapper>
    </form>
  );
};
