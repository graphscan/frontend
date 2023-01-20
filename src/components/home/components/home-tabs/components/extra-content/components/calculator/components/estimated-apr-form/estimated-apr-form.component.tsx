import { SyntheticEvent, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Controls } from './estimated-apr-form.styled';
import { Switch } from './components/switch/switch.component';
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
import { homeTabsViewModel } from '../../../../../../home-tabs.model';
import { CalculatorInput } from '../calculator-input/calculator-input.component';
import { TransactionButton } from '../../../../../../../../../common/transaction-button/transaction-button.component';

type Props = {
  onSubmit: () => void;
};

export const EstimatedAprForm: React.FC<Props> = observer(({ onSubmit }) => {
  const {
    plannedDelegation,
    plannedIndexerCut,
    shouldCalculateIndexerCut,
    setPlannedDelegation,
    setPlannedIndexerCut,
    setShouldCalculateIndexerCut,
  } = homeTabsViewModel;

  const [delegation, setDelegation] = useState(plannedDelegation);
  const [indexerCut, setIndexerCut] = useState(plannedIndexerCut);
  const [shouldCalculate, setShouldCalculate] = useState(shouldCalculateIndexerCut);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setPlannedDelegation(delegation);
    setPlannedIndexerCut(indexerCut);
    setShouldCalculateIndexerCut(shouldCalculate);
    onSubmit();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Content>
        <div>
          <DescriptionText>
            To receive estimated rewards on planned delegation, put the planned sum into the calculator field.
            Results per each Indexer will be displayed in the “Estimated APR” and “Estimated daily reward,
            GRT” columns. The calculations are made on the assumption that the proposed delegation will be
            added to the allocation by the Indexer according to the current ratios. No query fees are included
            in these calculations. Column “Estimated APR” shows APR for added delegations.
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
          <Controls>
            <Label>
              Potential delegation
              <InputWrapper>
                <CalculatorInput
                  setInput={setDelegation}
                  placeholder="GRT"
                  defaultInput={plannedDelegation}
                />
              </InputWrapper>
            </Label>
            <div className="controls-indexer-cut">
              <Label>
                Potential indexer cut
                <InputWrapper>
                  <CalculatorInput
                    disabled={!shouldCalculate}
                    setInput={setIndexerCut}
                    placeholder="%"
                    defaultInput={plannedIndexerCut}
                  />
                  <div className="controls-switch-box">
                    <Switch checked={shouldCalculate} onChange={setShouldCalculate} />
                  </div>
                </InputWrapper>
              </Label>
            </div>
          </Controls>
          <Notice>
            Please note, that rewards depend on many parameters: total amount of delegations in the network
            and in the indexer pool, the behaviour of the indexer, his fees and cuts, his ability to choose
            good subgraphs to maximise the profit. All of this makes calculations approximate. And we
            seriously recommend doing your own research before delegating your funds to any indexer.
          </Notice>
        </div>
      </Content>
      <ButtonWrapper>
        <TransactionButton
          disabled={!Boolean(parseFloat(delegation)) || (shouldCalculate && !Boolean(parseFloat(indexerCut)))}
        >
          Save
        </TransactionButton>
      </ButtonWrapper>
    </Form>
  );
});
