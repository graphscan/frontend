import { ColumnType } from 'antd/es/table';
import { divideBy1e18 } from '../../../../../../utils/number.utils';
import {
  createTitleWithTooltipDescription,
  renderAccountId,
  renderFormattedValue,
  renderFormattedHighlightedValue,
  renderDate,
  formatTableDate,
} from '../../../../../../utils/table.utils';

export type IndexerDelegatorLite = {
  id: string;
  delegator: {
    id: string;
  };
  indexer: {
    id: string;
    delegatorShares: string;
    delegatedTokens: string;
    delegationExchangeRate: string;
  };
  stakedTokens: string;
  shareAmount: string;
  unstakedTokens: string;
  personalExchangeRate: string;
  realizedRewards: string;
  createdAt: number;
  lastUndelegatedAt: number | null;
};

export type IndexerDelegatorsRowLite = {
  id: string;
  delegatorId: string;
  key: string;
  currentDelegationAmount: number;
  stakedTokens: number;
  unstakedTokens: number;
  totalRewards: number;
  realizedRewards: number;
  unreleasedReward: number;
  createdAt: number;
  lastUndelegatedAt: number | null;
};

const titles: Record<Exclude<keyof IndexerDelegatorsRowLite, 'key' | 'id'>, string> = {
  delegatorId: 'Delegator Address',
  currentDelegationAmount: 'Current Delegation',
  stakedTokens: 'Delegated',
  unstakedTokens: 'Undelegated',
  totalRewards: 'Total Rewards',
  realizedRewards: 'Realized Rewards',
  unreleasedReward: 'Unrealized Rewards',
  createdAt: 'Delegation Created',
  lastUndelegatedAt: 'Last Undelegation',
};

export const columnsWidth = {
  '2560': [187, 235, 235, 235, 235, 234, 234, 235, 235],
  '1920': [172, 144, 144, 144, 144, 144, 144, 202, 202],
  '1440': [151, 129, 128, 128, 128, 128, 128, 180, 180],
  '1280': [131, 125, 125, 125, 125, 125, 124, 152, 152],
};

export const columns: Array<ColumnType<IndexerDelegatorsRowLite>> = [
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
  delegator: { id: delegatorId },
  indexer: { delegatorShares, delegatedTokens, delegationExchangeRate },
  stakedTokens,
  shareAmount,
  unstakedTokens,
  personalExchangeRate,
  realizedRewards: _realizedRewards,
  createdAt,
  lastUndelegatedAt,
}: IndexerDelegatorLite): IndexerDelegatorsRowLite => {
  const realizedRewards = divideBy1e18(_realizedRewards);
  const unrealizedRewards = divideBy1e18(
    (Number(delegationExchangeRate) - Number(personalExchangeRate)) * Number(shareAmount),
  );

  return {
    id,
    delegatorId,
    key: id,
    currentDelegationAmount:
      Number(delegatorShares) > 0
        ? divideBy1e18((Number(shareAmount) / Number(delegatorShares)) * Number(delegatedTokens))
        : 0,
    stakedTokens: divideBy1e18(stakedTokens),
    unstakedTokens: divideBy1e18(unstakedTokens),
    totalRewards: realizedRewards + unrealizedRewards,
    realizedRewards,
    unreleasedReward: unrealizedRewards,
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
  createdAt,
  lastUndelegatedAt,
}: IndexerDelegatorsRowLite) => ({
  [titles.delegatorId]: delegatorId,
  [titles.currentDelegationAmount]: currentDelegationAmount,
  [titles.stakedTokens]: stakedTokens,
  [titles.unstakedTokens]: unstakedTokens,
  [titles.totalRewards]: totalRewards,
  [titles.realizedRewards]: realizedRewards,
  [titles.unreleasedReward]: unreleasedReward,
  [titles.createdAt]: formatTableDate(createdAt),
  [titles.lastUndelegatedAt]: lastUndelegatedAt ? formatTableDate(lastUndelegatedAt) : null,
});
