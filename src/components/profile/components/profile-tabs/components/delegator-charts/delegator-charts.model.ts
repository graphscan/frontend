import { ChartItem } from '../chart/chart.model';
import { formatToChartDate } from '../../../../../../utils/chart.utils';
import { divideBy1e18 } from '../../../../../../utils/number.utils';
import { clampMiddle } from '../../../../../../utils/text.utils';

export type DelegatorReward = {
  id: string;
  reward: string;
  timestamp: number;
  epoch: number;
  blockNumber: number;
  indexer: {
    id: string;
  };
};

export const transformToChartData = (rewards: Array<DelegatorReward>): Array<ChartItem> =>
  Object.values(
    rewards.reduce<{ [key: string]: ChartItem }>(
      (acc, { timestamp, reward, indexer: { id } }: DelegatorReward) => {
        if (id in acc) {
          acc[id].x.push(formatToChartDate(timestamp * 1000));
          acc[id].y.push(divideBy1e18(reward));
        } else {
          acc[id] = {
            x: [formatToChartDate(timestamp * 1000)],
            y: [divideBy1e18(reward)],
            name: clampMiddle(id),
            text: id,
            hoverinfo: 'x+y+text',
            stackgroup: 'one',
            stackgaps: 'interpolate',
          };
        }

        return acc;
      },
      {},
    ),
  );
