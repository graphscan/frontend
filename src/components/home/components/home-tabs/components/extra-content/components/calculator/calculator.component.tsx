import React, { useState, useCallback, useEffect } from 'react';
import { EstimatedAprForm } from './components/estimated-apr-form/estimated-apr-form.component';
import { HistoricApyForm } from './components/historic-apy-form/historic-apy-form.component';
import { Container, Header, Tab } from './calculator.styled';

type Props = {
  isLite: boolean;
  close: () => void;
};

const STORAGE_KEY = 'calculator-tab';

export const Calculator: React.FC<Props> = ({ isLite, close }) => {
  const [tab, setTab] = useState<'Estimated APR' | 'Historic APY'>('Estimated APR');

  useEffect(() => {
    if (!isLite) {
      const tab = localStorage.getItem(STORAGE_KEY);
      if (tab === 'Estimated APR' || tab === 'Historic APY') {
        setTab(tab);
      }
    }
  }, [isLite]);

  const onSubmit = useCallback(() => {
    if (!isLite) {
      localStorage.setItem(STORAGE_KEY, tab);
    }
    close();
  }, [close, isLite, tab]);

  return (
    <Container>
      {!isLite && (
        <Header>
          <Tab onClick={() => setTab('Estimated APR')} active={tab === 'Estimated APR'}>
            Estimated APR
          </Tab>
          <Tab onClick={() => setTab('Historic APY')} active={tab === 'Historic APY'}>
            Historic APY
          </Tab>
        </Header>
      )}
      {isLite || tab === 'Estimated APR' ? (
        <EstimatedAprForm onSubmit={onSubmit} />
      ) : (
        <HistoricApyForm onSubmit={onSubmit} />
      )}
    </Container>
  );
};
