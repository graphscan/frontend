import { ChartItem } from '../chart/chart.model';
import { formatToChartDate } from '../../../../../../utils/chart.utils';
import { divideBy1e18, divideBy1e6 } from '../../../../../../utils/number.utils';

export type RewardCutsItem = {
  id: string;
  indexingRewardCut: number;
  indexingRewardEffectiveCut: number;
  queryFeeCut: number;
  queryFeeEffectiveCut: number;
  blockNumber: number;
  timestamp: number;
  epoch: number;
};

export type DelegationPoolItem = {
  id: string;
  stakedTokens: string;
  delegatedTokens: string;
  blockNumber: number;
  timestamp: number;
  epoch: number;
};

export const transformRewardCutsToChartData = (
  rewardCuts: Array<RewardCutsItem>,
): [ChartItem, ChartItem, ChartItem, ChartItem] => {
  const [x, indexingRewardCutY, indexingEffectiveCutY, queryFeeCutY, queryEffectiveCutY] = rewardCuts.reduce<
    [Array<string>, Array<number>, Array<number>, Array<number>, Array<number>]
  >(
    (
      acc,
      { indexingRewardCut, indexingRewardEffectiveCut, queryFeeCut, queryFeeEffectiveCut, timestamp },
    ) => {
      acc[0].push(formatToChartDate(timestamp * 1000));
      acc[1].push(divideBy1e6(indexingRewardCut));
      acc[2].push(Number(indexingRewardEffectiveCut));
      acc[3].push(divideBy1e6(queryFeeCut));
      acc[4].push(Number(queryFeeEffectiveCut));

      return acc;
    },
    [[], [], [], [], []],
  );

  return [
    {
      x,
      y: indexingRewardCutY,
      name: 'Indexing Cut %',
      type: 'scatter',
    },
    {
      x,
      y: indexingEffectiveCutY,
      name: 'Indexing Effective Cut %',
      type: 'scatter',
    },
    {
      x,
      y: queryFeeCutY,
      name: 'Query Fee Cut %',
      type: 'scatter',
    },
    {
      x,
      y: queryEffectiveCutY,
      name: 'Query Fee Effective Cut %',
      type: 'scatter',
    },
  ];
};

export const transformDelegationPoolToChartData = (
  pool: Array<DelegationPoolItem>,
): [ChartItem, ChartItem] => {
  const [x, stakedY, delegatedY] = pool.reduce<[Array<string>, Array<number>, Array<number>]>(
    (acc, { stakedTokens, delegatedTokens, timestamp }) => {
      acc[0].push(formatToChartDate(timestamp * 1000));
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
      name: 'Self Staked',
      stackgroup: 'one',
      stackgaps: 'interpolate',
    },
    {
      x,
      y: delegatedY,
      name: 'Delegations',
      stackgroup: 'one',
      stackgaps: 'interpolate',
    },
  ];
};
