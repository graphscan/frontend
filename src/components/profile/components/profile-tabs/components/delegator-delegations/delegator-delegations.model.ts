import { ColumnType } from "antd/es/table";
import { DelegationTransaction } from "../../../../../../model/web3-transactions.model";
import { divideBy1e18 } from "../../../../../../utils/number.utils";
import {
  createTitleWithTooltipDescription,
  renderAccountId,
  renderFormattedValue,
  renderFormattedToPercentValue,
  renderDate,
  formatTableDate,
} from "../../../../../../utils/table.utils";
import { calcStakeCurrentDelegation } from "../../../../../../utils/delegators.utils";

export type DelegatorDelegation = {
  id: string;
  indexer: {
    id: string;
    delegatorShares: string;
    delegatedTokens: string;
    delegationExchangeRate: string;
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

/**
 * Gets the base delegation ID (delegator-indexer) without data service suffix.
 */
const getBaseDelegationId = (id: string): string => {
  const parts = id.split("-");
  return parts.length > 2 ? `${parts[0]}-${parts[1]}` : id;
};

/**
 * Merges related delegatedStake entities that were split due to protocol upgrade.
 */
export const mergeSplitDelegations = (
  delegations: Array<DelegatorDelegation>
): Array<DelegatorDelegation> => {
  const groupedByBase = new Map<string, Array<DelegatorDelegation>>();

  for (const delegation of delegations) {
    const baseId = getBaseDelegationId(delegation.id);
    const group = groupedByBase.get(baseId) || [];
    group.push(delegation);
    groupedByBase.set(baseId, group);
  }

  const result: Array<DelegatorDelegation> = [];

  groupedByBase.forEach((group, baseId) => {
    if (group.length === 1) {
      result.push(group[0]);
    } else {
      const primary =
        group.find((d) => Number(d.shareAmount) > 0) ||
        group.find((d) => d.id === baseId) ||
        group[0];

      const merged: DelegatorDelegation = {
        id: baseId,
        indexer: primary.indexer,
        shareAmount: group
          .reduce((sum, d) => sum + Number(d.shareAmount), 0)
          .toString(),
        personalExchangeRate: primary.personalExchangeRate,
        stakedTokens: group
          .reduce((sum, d) => sum + Number(d.stakedTokens), 0)
          .toString(),
        unstakedTokens: group
          .reduce((sum, d) => sum + Number(d.unstakedTokens), 0)
          .toString(),
        createdAt: Math.min(...group.map((d) => d.createdAt)),
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
      };

      result.push(merged);
    }
  });

  return result;
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
  Exclude<
    keyof DelegatorDelegationsRow,
    "key" | "name" | "lockedTokens" | "lockedUntil"
  >,
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
};

export const columnsWidth = {
  "2560": [187, 133, 133, 133, 133, 133, 133, 133, 226, 226, 165, 165, 165],
  "1920": [167, 115, 115, 115, 130, 115, 115, 115, 202, 200, 148, 148, 148],
  "1440": [150, 110, 110, 110, 115, 110, 110, 110, 180, 180, 132, 132, 132],
  "1280": [130, 100, 100, 100, 100, 100, 100, 100, 155, 155, 120, 120, 120],
};

export const createDelegatorDelegationsColumns = (): Array<
  ColumnType<DelegatorDelegationsRow>
> => [
  {
    title: createTitleWithTooltipDescription(
      titles.id,
      "The indexer’s Ethereum address or ENS."
    ),
    dataIndex: "id",
    key: "id",
    render: renderAccountId("indexer-details"),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.currentDelegationAmount,
      "Size of delegation to indexer."
    ),
    dataIndex: "currentDelegationAmount",
    key: "currentDelegationAmount",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.shareAmount,
      "Delegations share of chosen Indexer’s pool."
    ),
    dataIndex: "shareAmount",
    key: "shareAmount",
    render: renderFormattedToPercentValue(),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.stakedTokens,
      "All-time delegations to the chosen Indexer."
    ),
    dataIndex: "stakedTokens",
    key: "stakedTokens",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.unstakedTokens,
      "All-time undelegations from the chosen indexer."
    ),
    dataIndex: "unstakedTokens",
    key: "unstakedTokens",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.realizedRewards,
      "The amount of <strong>already undelegated</strong> rewards from the chosen indexer."
    ),
    dataIndex: "realizedRewards",
    key: "realizedRewards",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.unreleasedReward,
      "The amount of <strong>accumulated and not yet undelegated</strong> rewards from the chosen indexer."
    ),
    dataIndex: "unreleasedReward",
    key: "unreleasedReward",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.unreleasedRewardsPercent,
      "Ratio of Rewards to Stake."
    ),
    dataIndex: "unreleasedRewardsPercent",
    key: "unreleasedRewardsPercent",
    render: renderFormattedToPercentValue(),
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
  const { id, delegatorShares, delegationExchangeRate, defaultDisplayName } =
    indexer;
  const currentDelegationAmount = divideBy1e18(
    calcStakeCurrentDelegation({ shareAmount, indexer })
  );

  // Unrealized Rewards = (delegationExchangeRate - personalExchangeRate) * shareAmount
  const unrealizedRewards = divideBy1e18(
    (Number(delegationExchangeRate) - Number(personalExchangeRate)) *
      Number(shareAmount)
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
    key: id,
    currentDelegationAmount,
    shareAmount: Number(shareAmount) / Number(delegatorShares),
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
  [titles.lastUndelegatedAt]: lastUndelegatedAt
    ? formatTableDate(lastUndelegatedAt)
    : null,
});
