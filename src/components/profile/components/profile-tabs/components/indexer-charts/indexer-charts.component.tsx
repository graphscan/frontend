import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  useDelegationPool,
  useRewardCuts,
  useTotalAllocatedByNetworks,
} from "./indexer-charts.service";
import { Control } from "./components/control/control.component";
import type {
  CartesianChartProps,
  PieChartProps,
} from "../chart/chart.component";
import { Empty } from "../../../../../common/empty/empty.component";
import { Footer } from "../../../../../common/footer/footer.component";
import { Select } from "../../../../../common/select/select.component";
import { TabPreloader } from "../../../../../common/tab-preloader/tab-preloader.component";
import {
  getInitialPeriod,
  chartRangeToUnixTime,
} from "../../../../../../utils/chart.utils";

const CartesianChart = dynamic<CartesianChartProps>(
  () =>
    import("../chart/chart.component").then(
      ({ CartesianChart }) => CartesianChart,
    ),
  {
    ssr: false,
    loading: () => <TabPreloader withFooter={false} />,
  },
);

const PieChart = dynamic<PieChartProps>(
  () => import("../chart/chart.component").then(({ PieChart }) => PieChart),
  {
    ssr: false,
    loading: () => <TabPreloader withFooter={false} />,
  },
);

const charts = {
  rewardCuts: "Indexing Reward Cut Changes",
  delegationPool: "Delegation Pool",
  totalAllocatedByNetworks: "Total Allocated by Networks",
};

type Props = {
  id: string;
};

export const IndexerCharts: React.FC<Props> = ({ id }) => {
  const [chart, setChart] = useState(charts.rewardCuts);
  const [period, setPeriod] = useState(getInitialPeriod());

  const {
    data: delegationPool,
    error: dpError,
    isLoading: dpIsLoading,
  } = useDelegationPool({
    id,
    period: chartRangeToUnixTime(period),
    enabled: chart === charts.delegationPool,
  });

  const {
    data: rewardCuts,
    error: rcError,
    isLoading: rcIsLoading,
  } = useRewardCuts({
    id,
    period: chartRangeToUnixTime(period),
    enabled: chart === charts.rewardCuts,
  });

  const {
    data: totalAllocatedByNetworks,
    error: tabError,
    isLoading: tabIsLoading,
  } = useTotalAllocatedByNetworks({
    id,
    enabled: chart === charts.totalAllocatedByNetworks,
  });

  const handleChartChange = useCallback(
    (option: { label: string; value: string } | null) => {
      if (option) {
        setChart(option.value);
        setPeriod(getInitialPeriod());
      }
    },
    [],
  );

  const Title = useMemo(() => {
    return (
      <Select<{ value: string; label: string }, false>
        onChange={handleChartChange}
        value={{ label: chart, value: chart }}
        options={Object.values(charts).map((c) => ({ label: c, value: c }))}
        components={{ Control }}
      />
    );
  }, [chart, handleChartChange]);

  const isLoading =
    (chart === charts.delegationPool && dpIsLoading) ||
    (chart === charts.rewardCuts && rcIsLoading) ||
    (chart === charts.totalAllocatedByNetworks && tabIsLoading);

  if (isLoading) {
    return <TabPreloader />;
  }

  const error = dpError || rcError || tabError;

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return <Empty />;
  }

  return (
    <>
      {(() => {
        switch (chart) {
          case charts.rewardCuts:
            return (
              <CartesianChart
                yPercent
                title={Title}
                data={rewardCuts ?? []}
                range={period}
                onRelayout={setPeriod}
              />
            );
          case charts.delegationPool:
            return (
              <CartesianChart
                data={delegationPool ?? []}
                title={Title}
                range={period}
                onRelayout={setPeriod}
              />
            );
          case charts.totalAllocatedByNetworks:
            return <PieChart data={totalAllocatedByNetworks} title={Title} />;
        }
      })()}
      <Footer />
    </>
  );
};
