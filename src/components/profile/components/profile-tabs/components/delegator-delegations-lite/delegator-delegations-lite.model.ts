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

export type DelegatorDelegationLite = {
  id: string;
  indexer: {
    id: string;
    delegatedTokens: string;
    delegatorShares: string;
    defaultDisplayName: string | null;
  };
  shareAmount: string;
  stakedTokens: string;
  unstakedTokens: string;
  realizedRewards: string;
  createdAt: number;
  lastUndelegatedAt: number | null;
  lockedUntil: number;
  lockedTokens: string;
};

export type DelegatorDelegationsRowLite = {
  id: string;
  key: string;
  name: string | null;
  currentDelegationAmount: number;
  sharesRate: number;
  stakedTokens: number;
  unstakedTokens: number;
  realizedRewards: number;
  createdAt: number;
  lastUndelegatedAt: number | null;
  lockedUntil: number;
  lockedTokens: number;
};

const titles: Record<
  Exclude<keyof DelegatorDelegationsRowLite, 'key' | 'name' | 'lockedTokens' | 'lockedUntil'>,
  string
> = {
  id: 'Indexer Address',
  currentDelegationAmount: 'Current Delegation',
  sharesRate: 'Share of pool',
  stakedTokens: 'Delegated Total',
  unstakedTokens: 'Undelegated Total',
  realizedRewards: 'Realized Rewards',
  createdAt: 'Delegation Created',
  lastUndelegatedAt: 'Last Undelegation',
};

export const columnsWidth = {
  '2560': [187, 133, 133, 133, 133, 133, 226, 226, 165, 165, 165],
  '1920': [167, 115, 115, 115, 130, 115, 202, 200, 148, 148, 148],
  '1440': [150, 110, 110, 110, 115, 110, 180, 180, 132, 132, 132],
  '1280': [130, 100, 100, 100, 100, 100, 155, 155, 120, 120, 120],
};

export const createDelegatorDelegationsColumns = (
  createTransactionButtonRenderer: (
    transaction: DelegationTransaction,
  ) => (_: undefined, row: DelegatorDelegationsRowLite) => JSX.Element,
): Array<ColumnType<DelegatorDelegationsRowLite>> => [
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
      titles.sharesRate,
      'Delegations share of chosen Indexer’s pool.',
    ),
    dataIndex: 'sharesRate',
    key: 'sharesRate',
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
  indexer: { id, delegatedTokens, delegatorShares, defaultDisplayName },
  shareAmount,
  stakedTokens,
  unstakedTokens,
  realizedRewards,
  createdAt,
  lastUndelegatedAt,
  lockedUntil,
  lockedTokens,
}: DelegatorDelegationLite): DelegatorDelegationsRowLite => {
  const shares = Number(delegatorShares);
  const sharesRate = shares > 0 ? Number(shareAmount) / shares : 0;
  const currentDelegationAmount = divideBy1e18(sharesRate * Number(delegatedTokens));

  return {
    id,
    name: defaultDisplayName,
    key: id,
    currentDelegationAmount,
    sharesRate,
    stakedTokens: divideBy1e18(stakedTokens),
    unstakedTokens: divideBy1e18(unstakedTokens),
    realizedRewards: divideBy1e18(realizedRewards),
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
  sharesRate,
  stakedTokens,
  unstakedTokens,
  realizedRewards,
  createdAt,
  lastUndelegatedAt,
}: DelegatorDelegationsRowLite) => ({
  [titles.id]: name ?? id,
  [titles.currentDelegationAmount]: currentDelegationAmount,
  [titles.sharesRate]: sharesRate,
  [titles.stakedTokens]: stakedTokens,
  [titles.unstakedTokens]: unstakedTokens,
  [titles.realizedRewards]: realizedRewards,
  [titles.createdAt]: formatTableDate(createdAt),
  [titles.lastUndelegatedAt]: lastUndelegatedAt ? formatTableDate(lastUndelegatedAt) : null,
});
