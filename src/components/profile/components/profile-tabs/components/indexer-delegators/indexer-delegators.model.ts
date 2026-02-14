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
  formatLockedUntil,
} from "../../../../../../utils/table.utils";
import {
  calcStakeCurrentDelegation,
  calcDelegationExchangeRate,
} from "../../../../../../utils/delegators.utils";

export type IndexerDelegator = {
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

/**
 * Gets the base delegation ID (delegator-indexer) without data service suffix.
 * Old format: {delegator}-{indexer}
 * New format: {delegator}-{indexer}-{dataService}
 */
const getBaseDelegationId = (id: string): string => {
  const parts = id.split("-");
  // If ID has 3 parts (with data service), return first two parts
  // If ID has 2 parts (old format), return as is
  return parts.length > 2 ? `${parts[0]}-${parts[1]}` : id;
};

/**
 * Merges related delegatedStake entities that were split due to protocol upgrade.
 * Entities with same delegator-indexer base ID but different data service suffix
 * should be merged into one.
 */
export const mergeSplitDelegations = (
  delegations: Array<IndexerDelegator>,
): Array<IndexerDelegator> => {
  const groupedByBase = new Map<string, Array<IndexerDelegator>>();

  // Group by base ID (delegator-indexer)
  for (const delegation of delegations) {
    const baseId = getBaseDelegationId(delegation.id);
    const group = groupedByBase.get(baseId) || [];
    group.push(delegation);
    groupedByBase.set(baseId, group);
  }

  const result: Array<IndexerDelegator> = [];

  groupedByBase.forEach((group, baseId) => {
    if (group.length === 1) {
      // No merge needed
      result.push(group[0]);
    } else {
      // Merge multiple entities
      // Find the "primary" entity (positive shareAmount or the shorter ID)
      const primary =
        group.find((d) => Number(d.shareAmount) > 0) ||
        group.find((d) => d.id === baseId) ||
        group[0];

      const merged: IndexerDelegator = {
        id: baseId,
        delegator: primary.delegator,
        indexer: primary.indexer,
        // Sum numeric values
        shareAmount: group
          .reduce((sum, d) => sum + Number(d.shareAmount), 0)
          .toString(),
        stakedTokens: group
          .reduce((sum, d) => sum + Number(d.stakedTokens), 0)
          .toString(),
        unstakedTokens: group
          .reduce((sum, d) => sum + Number(d.unstakedTokens), 0)
          .toString(),
        // Take earliest createdAt
        createdAt: Math.min(...group.map((d) => d.createdAt)),
        // Take non-null dates
        lastDelegatedAt:
          group.find((d) => d.lastDelegatedAt !== null)?.lastDelegatedAt ??
          null,
        lastUndelegatedAt:
          group.find((d) => d.lastUndelegatedAt !== null)?.lastUndelegatedAt ??
          null,
        lockedUntil: Math.max(...group.map((d) => d.lockedUntil)),
        lockedTokens: group
          .reduce((sum, d) => sum + Number(d.lockedTokens), 0)
          .toString(),
        // Take personalExchangeRate from entity with positive shareAmount (real rate, not "1")
        personalExchangeRate: primary.personalExchangeRate,
      };

      result.push(merged);
    }
  });

  return result;
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
  lockedUntil: number;
  lockedTokens: number;
};

const titles: Record<
  Exclude<keyof IndexerDelegatorsRow, "key" | "id">,
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
      "Size of delegation from the chosen Delegator to the chosen Indexer.",
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
    calcStakeCurrentDelegation({ shareAmount, indexer }),
  );

  // Unrealized Rewards = (delegationExchangeRate - personalExchangeRate) * shareAmount
  const unrealizedRewards = divideBy1e18(
    (calcDelegationExchangeRate(indexer) - Number(personalExchangeRate)) *
      Number(shareAmount),
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
  [titles.lockedUntil]: formatLockedUntil(lockedUntil),
});
