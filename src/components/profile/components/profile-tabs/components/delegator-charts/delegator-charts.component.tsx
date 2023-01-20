import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useDelegatorRewards } from './delegator-charts.service';
import type { Props as ChartProps } from '../chart/chart.component';
import { Empty } from '../../../../../common/empty/empty.component';
import { Footer } from '../../../../../common/footer/footer.component';
import { TabPreloader } from '../../../../../common/tab-preloader/tab-preloader.component';
import { getInitialPeriod, chartRangeToUnixTime } from '../../../../../../utils/chart.utils';

const Chart = dynamic<ChartProps>(() => import('../chart/chart.component').then(({ Chart }) => Chart), {
  ssr: false,
  loading: () => <TabPreloader withFooter={false} />,
});

type Props = {
  id: string;
};

export const DelegatorCharts: React.FC<Props> = ({ id }) => {
  const [period, setPeriod] = useState(getInitialPeriod());

  const { data, error, isLoading } = useDelegatorRewards({
    id,
    period: chartRangeToUnixTime(period),
  });

  if (isLoading) {
    return <TabPreloader />;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return <Empty />;
  }

  return (
    <>
      <Chart range={period} onRelayout={setPeriod} title="Delegator rewards" data={data ?? []} />
      <Footer />
    </>
  );
};
