import { DelegationPoolSource } from "../../../../../../model/delegators.model";
import { formatLockedUntil } from "../../../../../../utils/delegation-lock.utils";
import { ColumnType } from "antd/es/table";
import { DelegationTransaction } from "../../../../../../model/web3-transactions.model";
import { divideBy1e18 } from "../../../../../../utils/number.utils";
import {
  createTitleWithTooltipDescription,
  renderAccountId,
  renderFormattedValue,
  renderFormattedToPercentValue,
  renderDate,
  renderLockedUntil,
  formatTableDate,
} from "../../../../../../utils/table.utils";
import {
  calcStakeCurrentDelegation,
  calcStakeUnrealizedRewards,
  getDelegationPool,
} from "../../../../../../utils/delegators.utils";

export type DelegatorDelegation = DelegationPoolSource & {
  isLegacy: boolean;
  id: string;
  indexer: {
    id: string;
    delegatorShares: string;
    delegatedTokens: string;
    delegatedThawingTokens: string;
    defaultDisplayName: string | null;
  };
  shareAmount: string;
  personalExchangeRate: string;
  stakedTokens: string;
  unstakedTokens: string;
  createdAt: number;
  lastDelegatedAt: number | null;
  lastUndelegatedAt: number | null;
  lockedUntil: number;
  lockedTokens: string;
};

export type DelegatorDelegationsRow = {
  isLegacy: boolean;
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
  Exclude<keyof DelegatorDelegationsRow, "key" | "name" | "isLegacy">,
  string
> = {
  id: "Indexer Address",
  currentDelegationAmount: "Current Delegation",
  shareAmount: "Share of pool",
  stakedTokens: "Delegated Total",
  unstakedTokens: "Undelegated Total",
  realizedRewards: "Realized Rewards",
  unreleasedReward: "Unrealized Rewards",
  unreleasedRewardsPercent: "Unrealized %",
  createdAt: "Delegation Created",
  lastUndelegatedAt: "Last Undelegation",
  lockedTokens: "Locked Tokens",
  lockedUntil: "Locked Until",
};

export const columnsWidth = {
  "2560": [
    187, 133, 133, 133, 133, 133, 133, 133, 133, 226, 226, 226, 165, 165, 165,
  ],
  "1920": [
    167, 115, 115, 115, 130, 115, 115, 115, 115, 202, 200, 200, 148, 148, 148,
  ],
  "1440": [
    150, 110, 110, 110, 115, 110, 110, 110, 110, 180, 180, 180, 132, 132, 132,
  ],
  "1280": [
    130, 100, 100, 100, 100, 100, 100, 100, 100, 155, 155, 155, 120, 120, 120,
  ],
};

export const createDelegatorDelegationsColumns = (): Array<
  ColumnType<DelegatorDelegationsRow>
> => [
  {
    title: createTitleWithTooltipDescription(
      titles.id,
      "The indexer’s Ethereum address or ENS.",
    ),
    dataIndex: "id",
    key: "id",
    render: renderAccountId("indexer-details"),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.currentDelegationAmount,
      "Active delegation, including accumulated rewards. Excludes tokens thawing for withdrawal.",
    ),
    dataIndex: "currentDelegationAmount",
    key: "currentDelegationAmount",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.shareAmount,
      "Delegations share of chosen Indexer’s pool.",
    ),
    dataIndex: "shareAmount",
    key: "shareAmount",
    render: renderFormattedToPercentValue(),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.stakedTokens,
      "All-time delegations to the chosen Indexer.",
    ),
    dataIndex: "stakedTokens",
    key: "stakedTokens",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.unstakedTokens,
      "All-time undelegations from the chosen indexer.",
    ),
    dataIndex: "unstakedTokens",
    key: "unstakedTokens",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.realizedRewards,
      "The amount of <strong>already undelegated</strong> rewards from the chosen indexer.",
    ),
    dataIndex: "realizedRewards",
    key: "realizedRewards",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.unreleasedReward,
      "The amount of <strong>accumulated and not yet undelegated</strong> rewards from the chosen indexer.",
    ),
    dataIndex: "unreleasedReward",
    key: "unreleasedReward",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.unreleasedRewardsPercent,
      "Ratio of Rewards to Stake.",
    ),
    dataIndex: "unreleasedRewardsPercent",
    key: "unreleasedRewardsPercent",
    render: renderFormattedToPercentValue(),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.lockedTokens,
      "Amount of tokens locked in the delegation.",
    ),
    dataIndex: "lockedTokens",
    key: "lockedTokens",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(titles.createdAt),
    dataIndex: "createdAt",
    key: "createdAt",
    align: "center",
    render: renderDate,
  },
  {
    title: createTitleWithTooltipDescription(titles.lastUndelegatedAt),
    dataIndex: "lastUndelegatedAt",
    key: "lastUndelegatedAt",
    align: "center",
    render: renderDate,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.lockedUntil,
      "Date or epoch until which tokens are locked.",
    ),
    dataIndex: "lockedUntil",
    key: "lockedUntil",
    align: "center",
    render: renderLockedUntil,
  },
  // {
  //   title: createTitleWithTooltipDescription("Delegate"),
  //   dataIndex: "delegate",
  //   key: "delegate",
  //   align: "center",
  //   render: createTransactionButtonRenderer("delegate"),
  // },
  // {
  //   title: createTitleWithTooltipDescription("Undelegate"),
  //   dataIndex: "undelegate",
  //   key: "undelegate",
  //   align: "center",
  //   render: createTransactionButtonRenderer("undelegate"),
  // },
  // {
  //   title: createTitleWithTooltipDescription("Withdraw"),
  //   dataIndex: "withdraw",
  //   key: "withdraw",
  //   align: "center",
  //   render: createTransactionButtonRenderer("withdraw"),
  // },
];

export const transformToRow = ({
  isLegacy,
  provision,
  id: stakeId,
  indexer,
  shareAmount,
  personalExchangeRate,
  stakedTokens,
  unstakedTokens,
  createdAt,
  lastUndelegatedAt,
  lockedUntil,
  lockedTokens,
}: DelegatorDelegation): DelegatorDelegationsRow => {
  const { id, defaultDisplayName } = indexer;
  const poolShares = Number(
    getDelegationPool({ indexer, provision }).delegatorShares,
  );
  const currentDelegationAmount = divideBy1e18(
    calcStakeCurrentDelegation({ shareAmount, indexer, provision }),
  );

  // Unrealized Rewards = (delegationExchangeRate - personalExchangeRate) * shareAmount
  const unrealizedRewards = divideBy1e18(
    calcStakeUnrealizedRewards({
      shareAmount,
      personalExchangeRate,
      indexer,
      provision,
    }),
  );

  const stakedTokensValue = divideBy1e18(stakedTokens);
  const unstakedTokensValue = divideBy1e18(unstakedTokens);

  // Total Rewards = (unstaked + currentDelegation) - staked
  const totalRewards =
    unstakedTokensValue + currentDelegationAmount - stakedTokensValue;

  // Realized Rewards = Total Rewards - Unrealized Rewards
  const realizedRewardsValue = totalRewards - unrealizedRewards;

  return {
    id,
    name: defaultDisplayName,
    key: stakeId,
    isLegacy,
    currentDelegationAmount,
    shareAmount: poolShares === 0 ? 0 : Number(shareAmount) / poolShares,
    stakedTokens: stakedTokensValue,
    unstakedTokens: unstakedTokensValue,
    realizedRewards: realizedRewardsValue,
    unreleasedReward: unrealizedRewards,
    unreleasedRewardsPercent:
      currentDelegationAmount === 0
        ? 0
        : unrealizedRewards / currentDelegationAmount,
    createdAt,
    lastUndelegatedAt,
    lockedUntil,
    lockedTokens: divideBy1e18(lockedTokens),
  };
};

export const transformToCsvRow = ({
  isLegacy,
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
  lockedTokens,
  lockedUntil,
}: DelegatorDelegationsRow) => ({
  [titles.id]: name ?? id,
  [titles.currentDelegationAmount]: currentDelegationAmount,
  [titles.shareAmount]: shareAmount,
  [titles.stakedTokens]: stakedTokens,
  [titles.unstakedTokens]: unstakedTokens,
  [titles.realizedRewards]: realizedRewards,
  [titles.unreleasedReward]: unreleasedReward,
  [titles.unreleasedRewardsPercent]: unreleasedRewardsPercent,
  [titles.lockedTokens]: lockedTokens,
  [titles.createdAt]: formatTableDate(createdAt),
  [titles.lastUndelegatedAt]: lastUndelegatedAt
    ? formatTableDate(lastUndelegatedAt)
    : null,
  [titles.lockedUntil]: formatLockedUntil(lockedUntil, isLegacy),
});
