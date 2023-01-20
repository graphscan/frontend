import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { useDelegationPool, useRewardCuts } from './indexer-charts.service';
import { Control } from './components/control/control.component';
import type { Props as ChartProps } from '../chart/chart.component';
import { Empty } from '../../../../../common/empty/empty.component';
import { Footer } from '../../../../../common/footer/footer.component';
import { Select } from '../../../../../common/select/select.component';
import { TabPreloader } from '../../../../../common/tab-preloader/tab-preloader.component';
import { getInitialPeriod, chartRangeToUnixTime } from '../../../../../../utils/chart.utils';

const Chart = dynamic<ChartProps>(() => import('../chart/chart.component').then(({ Chart }) => Chart), {
  ssr: false,
  loading: () => <TabPreloader withFooter={false} />,
});

const charts = {
  rewardCuts: 'Indexing Reward Cut Changes',
  delegationPool: 'Delegation Pool',
};

type Props = {
  id: string;
};

export const IndexerCharts: React.FC<Props> = ({ id }) => {
  const [chart, setChart] = useState(charts.rewardCuts);
  const [period, setPeriod] = useState(getInitialPeriod());

  const { data: delegationPool, error: dpError, isLoading: dpIsLoading } = useDelegationPool({
    id,
    period: chartRangeToUnixTime(period),
    enabled: chart === charts.delegationPool,
  });

  const { data: rewardCuts, error: rcError, isLoading: rcIsLoading } = useRewardCuts({
    id,
    period: chartRangeToUnixTime(period),
    enabled: chart === charts.rewardCuts,
  });

  const handleChartChange = useCallback((option: { label: string; value: string } | null) => {
    if (option) {
      setChart(option.value);
      setPeriod(getInitialPeriod());
    }
  }, []);

  const isLoading =
    (chart === charts.delegationPool && dpIsLoading) || (chart === charts.rewardCuts && rcIsLoading);

  if (isLoading) {
    return <TabPreloader />;
  }

  const error = dpError || rcError;

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return <Empty />;
  }

  const data = chart === charts.rewardCuts ? rewardCuts ?? [] : delegationPool ?? [];

  return (
    <>
      <Chart
        yPercent={chart === charts.rewardCuts}
        title={
          <Select
            onChange={handleChartChange}
            value={{ label: chart, value: chart }}
            options={Object.values(charts).map((c) => ({ label: c, value: c }))}
            components={{ Control }}
          />
        }
        data={data}
        range={period}
        onRelayout={setPeriod}
      />
      <Footer />
    </>
  );
};
