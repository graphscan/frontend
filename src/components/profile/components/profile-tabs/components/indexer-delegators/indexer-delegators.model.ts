import { DelegationPoolSource } from "../../../../../../model/delegators.model";
import { formatLockedUntil } from "../../../../../../utils/delegation-lock.utils";
import { ColumnType } from "antd/es/table";
import { divideBy1e18 } from "../../../../../../utils/number.utils";
import {
  createTitleWithTooltipDescription,
  renderAccountId,
  renderFormattedValue,
  renderFormattedHighlightedValue,
  renderFormattedToPercentValue,
  renderDate,
  renderLockedUntil,
  formatTableDate,
} from "../../../../../../utils/table.utils";
import {
  calcStakeCurrentDelegation,
  calcStakeUnrealizedRewards,
} from "../../../../../../utils/delegators.utils";

export type IndexerDelegator = DelegationPoolSource & {
  isLegacy: boolean;
  id: string;
  delegator: {
    id: string;
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
  indexer: {
    id: string;
    delegatorShares: string;
    delegatedTokens: string;
    delegatedThawingTokens: string;
  };
};

export type IndexerDelegatorsRow = {
  isLegacy: boolean;
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
  lockedUntil: number;
  lockedTokens: number;
};

const titles: Record<
  Exclude<keyof IndexerDelegatorsRow, "key" | "id" | "isLegacy">,
  string
> = {
  delegatorId: "Delegator Address",
  currentDelegationAmount: "Current Delegation",
  stakedTokens: "Delegated",
  unstakedTokens: "Undelegated",
  totalRewards: "Total Rewards",
  realizedRewards: "Realized Rewards",
  unreleasedReward: "Unrealized Rewards",
  unreleasedRewardsPercent: "Unrealized %",
  createdAt: "Delegation Created",
  lastUndelegatedAt: "Last Undelegation",
  lockedTokens: "Locked Tokens",
  lockedUntil: "Locked Until",
};

export const columnsWidth = {
  "2560": [187, 204, 204, 204, 204, 204, 204, 204, 204, 225, 225, 225],
  "1920": [172, 123, 123, 129, 123, 122, 122, 122, 122, 202, 202, 202],
  "1440": [151, 109, 109, 115, 109, 109, 109, 109, 109, 180, 180, 180],
  "1280": [131, 107, 107, 107, 107, 107, 107, 107, 107, 152, 152, 152],
};

export const columns: Array<ColumnType<IndexerDelegatorsRow>> = [
  {
    title: createTitleWithTooltipDescription(
      titles.delegatorId,
      "The delegator’s Ethereum address or ENS.",
    ),
    dataIndex: "delegatorId",
    key: "delegatorId",
    render: renderAccountId("delegator-details"),
    align: "center",
  },
  {
    title: createTitleWithTooltipDescription(
      titles.currentDelegationAmount,
      "Active delegated tokens, including accumulated rewards. Excludes thawing funds. The sum matches Active Delegation Pool in the profile at the same snapshot.",
    ),
    dataIndex: "currentDelegationAmount",
    key: "currentDelegationAmount",
    render: renderFormattedHighlightedValue(),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.stakedTokens,
      "All time delegated to chosen indexer.",
    ),
    dataIndex: "stakedTokens",
    key: "stakedTokens",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.unstakedTokens,
      "All time undelegated from chosen indexer.",
    ),
    dataIndex: "unstakedTokens",
    key: "unstakedTokens",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.totalRewards,
      "Realized rewards + Unrealized rewards of delegations to the chosen indexer.",
    ),
    dataIndex: "totalRewards",
    key: "totalRewards",
    render: renderFormattedHighlightedValue("#4cd08e"),
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
      "The amount of rewards <strong>accumulated and not yet undelegated</strong> from chosen indexer.",
    ),
    dataIndex: "unreleasedReward",
    key: "unreleasedReward",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.unreleasedRewardsPercent,
      "Ratio of Unrealized Rewards to <strong>Current Delegation</strong>",
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
];

export const transformToRow = ({
  isLegacy,
  provision,
  id,
  delegator: { id: delegatorId },
  shareAmount,
  personalExchangeRate,
  stakedTokens,
  unstakedTokens,
  createdAt,
  lastUndelegatedAt,
  lockedUntil,
  lockedTokens,
  indexer,
}: IndexerDelegator): IndexerDelegatorsRow => {
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
    delegatorId,
    key: id,
    isLegacy,
    currentDelegationAmount,
    stakedTokens: stakedTokensValue,
    unstakedTokens: unstakedTokensValue,
    totalRewards,
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
  lockedTokens,
  lockedUntil,
}: IndexerDelegatorsRow) => ({
  [titles.delegatorId]: delegatorId,
  [titles.currentDelegationAmount]: currentDelegationAmount,
  [titles.stakedTokens]: stakedTokens,
  [titles.unstakedTokens]: unstakedTokens,
  [titles.totalRewards]: totalRewards,
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
