import { ColumnType } from 'antd/es/table';
import {
  createTitleWithTooltipDescription,
  renderAccountId,
  renderFormattedValue,
  renderDate,
  formatTableDate,
} from '../../../../../../utils/table.utils';
import { divideBy1e18 } from '../../../../../../utils/number.utils';

export type DelegatorLite = {
  id: string;
  totalStakedTokens: string;
  totalUnstakedTokens: string;
  activeStakesCount: number;
  totalRealizedRewards: string;
  lastDelegationAt: [{ id: string; lastDelegatedAt: number | null }?];
  lastUnDelegationAt: [{ id: string; lastUndelegatedAt: number | null }?];
};

export type DelegatorsRowLite = {
  id: string;
  key: string;
  totalStakedTokens: number;
  totalUnstakedTokens: number;
  totalRealizedRewards: number;
  activeStakesCount: number;
  lastDelegationAt: number | null;
  lastUnDelegationAt: number | null;
};

const titles: Record<Exclude<keyof DelegatorsRowLite, 'key'>, string> = {
  id: 'Delegator Address',
  totalStakedTokens: 'Delegated Total',
  totalUnstakedTokens: 'Undelegated Total',
  activeStakesCount: 'Delegations Count',
  totalRealizedRewards: 'Realized Rewards',
  lastDelegationAt: 'Last Delegation',
  lastUnDelegationAt: 'Last Undelegation',
};

export const columnsWidth = {
  '2560': [189, 344, 344, 344, 344, 250, 250],
  '1920': [172, 214, 214, 214, 214, 206, 206],
  '1440': [150, 190, 190, 190, 190, 185, 185],
  '1280': [132, 178, 178, 178, 178, 170, 170],
};

export const columns: Array<ColumnType<DelegatorsRowLite>> = [
  {
    title: createTitleWithTooltipDescription(titles.id, 'The delegator’s Ethereum address or ENS.'),
    dataIndex: 'id',
    key: 'id',
    render: renderAccountId('delegator-details'),
    align: 'center',
  },
  {
    title: createTitleWithTooltipDescription(
      titles.totalStakedTokens,
      'Sum of all-time delegations to indexers including repeat delegations.',
    ),
    dataIndex: 'totalStakedTokens',
    key: 'totalStakedTokens',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.totalUnstakedTokens,
      'Sum of all-time undelegated GRTs from indexers.',
    ),
    dataIndex: 'totalUnstakedTokens',
    key: 'totalUnstakedTokens',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(titles.activeStakesCount, 'Current number of delegations.'),
    dataIndex: 'activeStakesCount',
    key: 'activeStakesCount',
  },
  {
    title: createTitleWithTooltipDescription(
      titles.totalRealizedRewards,
      'The amount of <strong>already undelegated</strong> rewards from indexers.',
    ),
    dataIndex: 'totalRealizedRewards',
    key: 'totalRealizedRewards',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(titles.lastDelegationAt),
    dataIndex: 'lastDelegationAt',
    key: 'lastDelegationAt',
    align: 'center',
    render: renderDate,
  },
  {
    title: createTitleWithTooltipDescription(titles.lastUnDelegationAt),
    dataIndex: 'lastUnDelegationAt',
    key: 'lastUnDelegationAt',
    align: 'center',
    render: renderDate,
  },
];

export const transformToRow = ({
  id,
  totalStakedTokens,
  totalUnstakedTokens,
  activeStakesCount,
  totalRealizedRewards,
  lastDelegationAt,
  lastUnDelegationAt,
}: DelegatorLite): DelegatorsRowLite => {
  return {
    id,
    key: id,
    totalStakedTokens: divideBy1e18(totalStakedTokens),
    totalUnstakedTokens: divideBy1e18(totalUnstakedTokens),
    totalRealizedRewards: divideBy1e18(totalRealizedRewards),
    activeStakesCount,
    lastDelegationAt: lastDelegationAt[0]?.lastDelegatedAt ?? null,
    lastUnDelegationAt: lastUnDelegationAt[0]?.lastUndelegatedAt ?? null,
  };
};

export const transformToCsvRow = ({
  id,
  totalStakedTokens,
  totalUnstakedTokens,
  totalRealizedRewards,
  activeStakesCount,
  lastDelegationAt,
  lastUnDelegationAt,
}: DelegatorsRowLite) => ({
  [titles.id]: id,
  [titles.totalStakedTokens]: totalStakedTokens,
  [titles.totalUnstakedTokens]: totalUnstakedTokens,
  [titles.totalRealizedRewards]: totalRealizedRewards,
  [titles.activeStakesCount]: activeStakesCount,
  [titles.lastDelegationAt]: lastDelegationAt ? formatTableDate(lastDelegationAt) : null,
  [titles.lastUnDelegationAt]: lastUnDelegationAt ? formatTableDate(lastUnDelegationAt) : null,
});
