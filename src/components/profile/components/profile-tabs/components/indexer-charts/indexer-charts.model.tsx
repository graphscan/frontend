import type { PieData } from "plotly.js";
import { CartesianChartItem } from "../chart/chart.model";
import { formatToChartDate } from "../../../../../../utils/chart.utils";
import {
  divideBy1e18,
  divideBy1e6,
} from "../../../../../../utils/number.utils";

export type IndexerDailyDataItem = {
  id: string;
  dayStart: string;
  dayNumber: number;
  indexingRewardCut: number;
  queryFeeCut: number;
  ownStakeRatio: string;
  stakedTokens: string;
  delegatedTokens: string;
};

// Alias types for backward compatibility
export type RewardCutsItem = IndexerDailyDataItem;
export type DelegationPoolItem = IndexerDailyDataItem;

export type TotalAllocatedByNetworksItem = {
  id: string;
  allocatedTokens: string;
  subgraphDeployment: {
    id: string;
    manifest: {
      network: string | null;
    } | null;
  };
};

// Calculate effective cut: 1 - (1 - cut) / (1 - ownStakeRatio)
const calcEffectiveCut = (
  cut: number,
  ownStakeRatio: number,
  hasDelegations: boolean,
): number => {
  if (!hasDelegations || ownStakeRatio >= 1) {
    return cut;
  }
  return 1 - (1 - cut) / (1 - ownStakeRatio);
};

export const transformRewardCutsToChartData = (
  rewardCuts: Array<RewardCutsItem>,
): [
  CartesianChartItem,
  CartesianChartItem,
  CartesianChartItem,
  CartesianChartItem,
] => {
  const [
    x,
    indexingRewardCutY,
    indexingEffectiveCutY,
    queryFeeCutY,
    queryEffectiveCutY,
  ] = rewardCuts.reduce<
    [Array<string>, Array<number>, Array<number>, Array<number>, Array<number>]
  >(
    (
      acc,
      {
        indexingRewardCut,
        queryFeeCut,
        ownStakeRatio,
        delegatedTokens,
        dayStart,
      },
    ) => {
      const cut = divideBy1e6(indexingRewardCut);
      const queryFee = divideBy1e6(queryFeeCut);
      const ratio = Number(ownStakeRatio);
      const hasDelegations = Number(delegatedTokens) > 0;

      acc[0].push(formatToChartDate(Number(dayStart) * 1000));
      acc[1].push(cut);
      acc[2].push(calcEffectiveCut(cut, ratio, hasDelegations));
      acc[3].push(queryFee);
      acc[4].push(calcEffectiveCut(queryFee, ratio, hasDelegations));

      return acc;
    },
    [[], [], [], [], []],
  );

  return [
    {
      x,
      y: indexingRewardCutY,
      name: "Indexing Cut %",
      type: "scatter",
    },
    {
      x,
      y: indexingEffectiveCutY,
      name: "Indexing Effective Cut %",
      type: "scatter",
    },
    {
      x,
      y: queryFeeCutY,
      name: "Query Fee Cut %",
      type: "scatter",
    },
    {
      x,
      y: queryEffectiveCutY,
      name: "Query Fee Effective Cut %",
      type: "scatter",
    },
  ];
};

export const transformDelegationPoolToChartData = (
  pool: Array<DelegationPoolItem>,
): [CartesianChartItem, CartesianChartItem] => {
  const [x, stakedY, delegatedY] = pool.reduce<
    [Array<string>, Array<number>, Array<number>]
  >(
    (acc, { stakedTokens, delegatedTokens, dayStart }) => {
      acc[0].push(formatToChartDate(Number(dayStart) * 1000));
      acc[1].push(divideBy1e18(stakedTokens));
      acc[2].push(divideBy1e18(delegatedTokens));

      return acc;
    },
    [[], [], []],
  );

  return [
    {
      x,
      y: stakedY,
      name: "Self Staked",
      stackgroup: "one",
      stackgaps: "interpolate",
    },
    {
      x,
      y: delegatedY,
      name: "Delegations",
      stackgroup: "one",
      stackgaps: "interpolate",
    },
  ];
};

export const transformTotalAllocatedByNetworksToPieData = (
  allocations: Array<TotalAllocatedByNetworksItem>,
): Partial<PieData> => {
  const networkAllocations = allocations.reduce<Record<string, number>>(
    (acc, allocation) => {
      const network =
        allocation.subgraphDeployment?.manifest?.network || "Unspecified";
      const allocatedTokens = divideBy1e18(allocation.allocatedTokens);

      acc[network] ??= 0;
      acc[network] += allocatedTokens;

      return acc;
    },
    {},
  );

  const values = Object.values(networkAllocations);
  const total = values.reduce((sum, value) => sum + value, 0);

  // Create labels with percentages for legend
  const labels = Object.keys(networkAllocations).map((network) => {
    const value = networkAllocations[network];
    const percentage = ((value / total) * 100).toFixed(1);
    return `${network} (${percentage}%)`;
  });

  // Create text for segments (percentages only for >= 5%)
  const text = values.map((value) => {
    const percentage = (value / total) * 100;
    return percentage >= 5 ? `${percentage.toFixed(1)}%` : "";
  });

  // Create original network names for tooltips
  const originalNames = Object.keys(networkAllocations);

  return {
    type: "pie",
    labels,
    values,
    text,
    customdata: originalNames,
    textinfo: "text",
    textposition: "inside",
    automargin: true,
    hovertemplate: `<b>%{customdata}</b><br>%{percent:.1%}<br>%{value:,.2f}</br><extra></extra>`,
    sort: false,
  };
};
