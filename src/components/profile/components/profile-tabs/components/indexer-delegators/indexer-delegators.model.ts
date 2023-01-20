import { ColumnType } from 'antd/es/table';
import { divideBy1e18 } from '../../../../../../utils/number.utils';
import {
  createTitleWithTooltipDescription,
  renderAccountId,
  renderFormattedValue,
  renderFormattedHighlightedValue,
  renderFormattedToPercentValue,
  renderDate,
  formatTableDate,
} from '../../../../../../utils/table.utils';

export type IndexerDelegator = {
  id: string;
  delegatorId: string;
  currentDelegationAmount: string;
  stakedTokens: string;
  unstakedTokens: string;
  totalRewards: string;
  realizedRewards: string;
  unreleasedReward: string;
  unreleasedRewardsPercent: string;
  createdAt: number;
  lastUndelegatedAt: number | null;
};

export type IndexerDelegatorsRow = {
  id: string;
  delegatorId: string;
  key: string;
  currentDelegationAmount: number;
  stakedTokens: number;
  unstakedTokens: number;
  totalRewards: number;
  realizedRewards: number;
  unreleasedReward: number;
  unreleasedRewardsPercent: number;
  createdAt: number;
  lastUndelegatedAt: number | null;
};

const titles: Record<Exclude<keyof IndexerDelegatorsRow, 'key' | 'id'>, string> = {
  delegatorId: 'Delegator Address',
  currentDelegationAmount: 'Current Delegation',
  stakedTokens: 'Delegated',
  unstakedTokens: 'Undelegated',
  totalRewards: 'Total Rewards',
  realizedRewards: 'Realized Rewards',
  unreleasedReward: 'Unrealized Rewards',
  unreleasedRewardsPercent: 'Unrealized %',
  createdAt: 'Delegation Created',
  lastUndelegatedAt: 'Last Undelegation',
};

export const columnsWidth = {
  '2560': [187, 204, 204, 204, 204, 204, 204, 204, 225, 225],
  '1920': [172, 123, 123, 129, 123, 122, 122, 122, 202, 202],
  '1440': [151, 109, 109, 115, 109, 109, 109, 109, 180, 180],
  '1280': [131, 107, 107, 107, 107, 107, 107, 107, 152, 152],
};

export const columns: Array<ColumnType<IndexerDelegatorsRow>> = [
  {
    title: createTitleWithTooltipDescription(titles.delegatorId, 'The delegator’s Ethereum address or ENS.'),
    dataIndex: 'delegatorId',
    key: 'delegatorId',
    render: renderAccountId('delegator-details'),
    align: 'center',
  },
  {
    title: createTitleWithTooltipDescription(
      titles.currentDelegationAmount,
      'Size of delegation from the chosen Delegator to the chosen Indexer.',
    ),
    dataIndex: 'currentDelegationAmount',
    key: 'currentDelegationAmount',
    render: renderFormattedHighlightedValue(),
  },
  {
    title: createTitleWithTooltipDescription(titles.stakedTokens, 'All time delegated to chosen indexer.'),
    dataIndex: 'stakedTokens',
    key: 'stakedTokens',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.unstakedTokens,
      'All time undelegated from chosen indexer.',
    ),
    dataIndex: 'unstakedTokens',
    key: 'unstakedTokens',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.totalRewards,
      'Realized rewards + Unrealized rewards of delegations to the chosen indexer.',
    ),
    dataIndex: 'totalRewards',
    key: 'totalRewards',
    render: renderFormattedHighlightedValue('#4cd08e'),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.realizedRewards,
      'The amount of <strong>already undelegated</strong> rewards from the chosen indexer.',
    ),
    dataIndex: 'realizedRewards',
    key: 'realizedRewards',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.unreleasedReward,
      'The amount of rewards <strong>accumulated and not yet undelegated</strong> from chosen indexer.',
    ),
    dataIndex: 'unreleasedReward',
    key: 'unreleasedReward',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.unreleasedRewardsPercent,
      'Ratio of Unrealized Rewards to <strong>Current Delegation</strong>',
    ),
    dataIndex: 'unreleasedRewardsPercent',
    key: 'unreleasedRewardsPercent',
    render: renderFormattedToPercentValue(),
  },
  {
    title: createTitleWithTooltipDescription(titles.createdAt),
    dataIndex: 'createdAt',
    key: 'createdAt',
    align: 'center',
    render: renderDate,
  },
  {
    title: createTitleWithTooltipDescription(titles.lastUndelegatedAt),
    dataIndex: 'lastUndelegatedAt',
    key: 'lastUndelegatedAt',
    align: 'center',
    render: renderDate,
  },
];

export const transformToRow = ({
  id,
  delegatorId,
  currentDelegationAmount,
  stakedTokens,
  unstakedTokens,
  totalRewards,
  realizedRewards,
  unreleasedReward,
  unreleasedRewardsPercent,
  createdAt,
  lastUndelegatedAt,
}: IndexerDelegator): IndexerDelegatorsRow => {
  return {
    id,
    delegatorId,
    key: id,
    currentDelegationAmount: divideBy1e18(currentDelegationAmount),
    stakedTokens: divideBy1e18(stakedTokens),
    unstakedTokens: divideBy1e18(unstakedTokens),
    totalRewards: divideBy1e18(totalRewards),
    realizedRewards: divideBy1e18(realizedRewards),
    unreleasedReward: divideBy1e18(unreleasedReward),
    unreleasedRewardsPercent: Number(unreleasedRewardsPercent),
    createdAt,
    lastUndelegatedAt,
  };
};

export const transformToCsvRow = ({
  delegatorId,
  currentDelegationAmount,
  stakedTokens,
  unstakedTokens,
  totalRewards,
  realizedRewards,
  unreleasedReward,
  unreleasedRewardsPercent,
  createdAt,
  lastUndelegatedAt,
}: IndexerDelegatorsRow) => ({
  [titles.delegatorId]: delegatorId,
  [titles.currentDelegationAmount]: currentDelegationAmount,
  [titles.stakedTokens]: stakedTokens,
  [titles.unstakedTokens]: unstakedTokens,
  [titles.totalRewards]: totalRewards,
  [titles.realizedRewards]: realizedRewards,
  [titles.unreleasedReward]: unreleasedReward,
  [titles.unreleasedRewardsPercent]: unreleasedRewardsPercent,
  [titles.createdAt]: formatTableDate(createdAt),
  [titles.lastUndelegatedAt]: lastUndelegatedAt ? formatTableDate(lastUndelegatedAt) : null,
});
