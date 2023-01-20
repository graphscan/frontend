import { SyntheticEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Form,
  Content,
  DescriptionText,
  Anchor,
  Label,
  InputWrapper,
  Notice,
  ButtonWrapper,
} from '../../calculator.styled';
import { CalculatorInput } from '../calculator-input/calculator-input.component';
import { homeTabsViewModel } from '../../../../../../home-tabs.model';
import { TransactionButton } from '../../../../../../../../../common/transaction-button/transaction-button.component';

type Props = {
  onSubmit: () => void;
};

export const HistoricApyForm: React.FC<Props> = observer(({ onSubmit }) => {
  const { plannedPeriod, setPlannedPeriod } = homeTabsViewModel;
  const [period, setPeriod] = useState(plannedPeriod);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setPlannedPeriod(period);
    onSubmit();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Content>
        <div>
          <DescriptionText>
            Rewards rate of indexer is based on period of the last N days and extrapolated to a year.
          </DescriptionText>
          <Anchor
            href="https://ryabina.medium.com/graphscan-io-by-ryabina-rewards-calculator-ced08b16e884"
            target="_blank"
            rel="noreferrer"
          >
            Know more
          </Anchor>
        </div>
        <div>
          <Label>
            N, number of days:
            <InputWrapper>
              <CalculatorInput setInput={setPeriod} placeholder="Days" defaultInput={plannedPeriod} />
            </InputWrapper>
          </Label>
          <Notice>
            Please note, that rewards depend on many parameters: total amount of delegations in the network
            and in the indexer pool, the behaviour of the indexer, his fees and cuts, his ability to choose
            good subgraphs to maximise the profit. Rates are estimates provided for your convenience only, and
            by no means represent guaranteed returns. And we seriously recommend doing your own research
            before delegating your funds to any indexer.
          </Notice>
        </div>
      </Content>
      <ButtonWrapper>
        <TransactionButton disabled={!period}>Save</TransactionButton>
      </ButtonWrapper>
    </Form>
  );
});
