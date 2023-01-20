import { ColumnType } from 'antd/es/table';
import { DelegationTransaction } from '../../../../../../model/web3-transations.model';
import { divideBy1e18 } from '../../../../../../utils/number.utils';
import {
  createTitleWithTooltipDescription,
  renderAccountId,
  renderFormattedValue,
  renderFormattedToPercentValue,
  renderDate,
  formatTableDate,
} from '../../../../../../utils/table.utils';

export type DelegatorDelegation = {
  id: string;
  indexer: {
    id: string;
    delegatorShares: string;
    defaultDisplayName: string | null;
  };
  currentDelegationAmount: string;
  shareAmount: string;
  stakedTokens: string;
  unstakedTokens: string;
  realizedRewards: string;
  unreleasedReward: string;
  unreleasedRewardsPercent: string;
  createdAt: number;
  lastUndelegatedAt: number | null;
  lockedUntil: number;
  lockedTokens: string;
};

export type DelegatorDelegationsRow = {
  id: string;
  key: string;
  name: string | null;
  currentDelegationAmount: number;
  shareAmount: number;
  stakedTokens: number;
  unstakedTokens: number;
  realizedRewards: number;
  unreleasedReward: number;
  unreleasedRewardsPercent: number;
  createdAt: number;
  lastUndelegatedAt: number | null;
  lockedUntil: number;
  lockedTokens: number;
};

const titles: Record<
  Exclude<keyof DelegatorDelegationsRow, 'key' | 'name' | 'lockedTokens' | 'lockedUntil'>,
  string
> = {
  id: 'Indexer Address',
  currentDelegationAmount: 'Current Delegation',
  shareAmount: 'Share of pool',
  stakedTokens: 'Delegated Total',
  unstakedTokens: 'Undelegated Total',
  realizedRewards: 'Realized Rewards',
  unreleasedReward: 'Unrealized Rewards',
  unreleasedRewardsPercent: 'Unrealized %',
  createdAt: 'Delegation Created',
  lastUndelegatedAt: 'Last Undelegation',
};

export const columnsWidth = {
  '2560': [187, 133, 133, 133, 133, 133, 133, 133, 226, 226, 165, 165, 165],
  '1920': [167, 115, 115, 115, 130, 115, 115, 115, 202, 200, 148, 148, 148],
  '1440': [150, 110, 110, 110, 115, 110, 110, 110, 180, 180, 132, 132, 132],
  '1280': [130, 100, 100, 100, 100, 100, 100, 100, 155, 155, 120, 120, 120],
};

export const createDelegatorDelegationsColumns = (
  createTransactionButtonRenderer: (
    transaction: DelegationTransaction,
  ) => (_: undefined, row: DelegatorDelegationsRow) => JSX.Element,
): Array<ColumnType<DelegatorDelegationsRow>> => [
  {
    title: createTitleWithTooltipDescription(titles.id, 'The indexer’s Ethereum address or ENS.'),
    dataIndex: 'id',
    key: 'id',
    render: renderAccountId('indexer-details'),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.currentDelegationAmount,
      'Size of delegation to indexer.',
    ),
    dataIndex: 'currentDelegationAmount',
    key: 'currentDelegationAmount',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.shareAmount,
      'Delegations share of chosen Indexer’s pool.',
    ),
    dataIndex: 'shareAmount',
    key: 'shareAmount',
    render: renderFormattedToPercentValue(),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.stakedTokens,
      'All-time delegations to the chosen Indexer.',
    ),
    dataIndex: 'stakedTokens',
    key: 'stakedTokens',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.unstakedTokens,
      'All-time undelegations from the chosen indexer.',
    ),
    dataIndex: 'unstakedTokens',
    key: 'unstakedTokens',
    render: renderFormattedValue,
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
      'The amount of <strong>accumulated and not yet undelegated</strong> rewards from the chosen indexer.',
    ),
    dataIndex: 'unreleasedReward',
    key: 'unreleasedReward',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(titles.unreleasedRewardsPercent, 'Ratio of Rewards to Stake.'),
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
  {
    title: createTitleWithTooltipDescription('Delegate'),
    dataIndex: 'delegate',
    key: 'delegate',
    align: 'center',
    render: createTransactionButtonRenderer('delegate'),
  },
  {
    title: createTitleWithTooltipDescription('Undelegate'),
    dataIndex: 'undelegate',
    key: 'undelegate',
    align: 'center',
    render: createTransactionButtonRenderer('undelegate'),
  },
  {
    title: createTitleWithTooltipDescription('Withdraw'),
    dataIndex: 'withdraw',
    key: 'withdraw',
    align: 'center',
    render: createTransactionButtonRenderer('withdraw'),
  },
];

export const transformToRow = ({
  indexer: { id, delegatorShares, defaultDisplayName },
  currentDelegationAmount,
  shareAmount,
  stakedTokens,
  unstakedTokens,
  realizedRewards,
  unreleasedReward,
  unreleasedRewardsPercent,
  createdAt,
  lastUndelegatedAt,
  lockedUntil,
  lockedTokens,
}: DelegatorDelegation): DelegatorDelegationsRow => {
  return {
    id,
    name: defaultDisplayName,
    key: id,
    currentDelegationAmount: divideBy1e18(currentDelegationAmount),
    shareAmount: Number(shareAmount) / Number(delegatorShares),
    stakedTokens: divideBy1e18(stakedTokens),
    unstakedTokens: divideBy1e18(unstakedTokens),
    realizedRewards: divideBy1e18(realizedRewards),
    unreleasedReward: divideBy1e18(unreleasedReward),
    unreleasedRewardsPercent: Number(unreleasedRewardsPercent),
    createdAt,
    lastUndelegatedAt,
    lockedUntil,
    lockedTokens: divideBy1e18(lockedTokens),
  };
};

export const transformToCsvRow = ({
  id,
  name,
  currentDelegationAmount,
  shareAmount,
  stakedTokens,
  unstakedTokens,
  realizedRewards,
  unreleasedReward,
  unreleasedRewardsPercent,
  createdAt,
  lastUndelegatedAt,
}: DelegatorDelegationsRow) => ({
  [titles.id]: name ?? id,
  [titles.currentDelegationAmount]: currentDelegationAmount,
  [titles.shareAmount]: shareAmount,
  [titles.stakedTokens]: stakedTokens,
  [titles.unstakedTokens]: unstakedTokens,
  [titles.realizedRewards]: realizedRewards,
  [titles.unreleasedReward]: unreleasedReward,
  [titles.unreleasedRewardsPercent]: unreleasedRewardsPercent,
  [titles.createdAt]: formatTableDate(createdAt),
  [titles.lastUndelegatedAt]: lastUndelegatedAt ? formatTableDate(lastUndelegatedAt) : null,
});
