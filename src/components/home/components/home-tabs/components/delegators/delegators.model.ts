import { ColumnType } from "antd/es/table";
import { DelegatedStakeExtended } from "../../../../../../model/delegators.model";
import {
  createTitleWithTooltipDescription,
  renderAccountId,
  renderFormattedValue,
  renderDate,
  formatTableDate,
} from "../../../../../../utils/table.utils";
import { divideBy1e18 } from "../../../../../../utils/number.utils";
import {
  calcCurrentDelegation,
  calcUnrealizedRewards,
  calcRealizedRewards,
} from "../../../../../../utils/delegators.utils";

export type Delegator = {
  id: string;
  totalStakedTokens: string;
  totalUnstakedTokens: string;
  activeStakesCount: number;
  lastDelegatedAt: Array<{ lastDelegatedAt: number | null }>;
  lastUndelegatedAt: Array<{ lastUndelegatedAt: number | null }>;
  stakes: Array<DelegatedStakeExtended>;
};

export type DelegatorsRow = {
  id: string;
  key: string;
  currentStaked: number;
  totalStakedTokens: number;
  totalUnstakedTokens: number;
  totalRealizedRewards: number;
  unreleasedReward: number;
  activeStakesCount: number;
  lastDelegatedAt: number | null;
  lastUndelegatedAt: number | null;
};

const titles: Record<Exclude<keyof DelegatorsRow, "key">, string> = {
  id: "Delegator Address",
  currentStaked: "Current Delegations",
  totalStakedTokens: "Delegated Total",
  totalUnstakedTokens: "Undelegated Total",
  activeStakesCount: "Delegations Count",
  totalRealizedRewards: "Realized Rewards",
  unreleasedReward: "Unrealized Rewards",
  lastDelegatedAt: "Last Delegation",
  lastUndelegatedAt: "Last Undelegation",
};

export const columnsWidth = {
  "2560": [187, 238, 238, 238, 238, 238, 238, 225, 225],
  "1920": [172, 143, 143, 143, 143, 143, 143, 205, 205],
  "1440": [150, 130, 130, 130, 130, 130, 130, 175, 175],
  "1280": [130, 125, 125, 125, 125, 125, 125, 152, 152],
};

export const columns: Array<ColumnType<DelegatorsRow>> = [
  {
    title: createTitleWithTooltipDescription(
      titles.id,
      "The delegator’s Ethereum address or ENS.",
    ),
    dataIndex: "id",
    key: "id",
    render: renderAccountId("delegator-details"),
    align: "center",
  },
  {
    title: createTitleWithTooltipDescription(
      titles.currentStaked,
      "Sum of current delegations to indexers.",
    ),
    dataIndex: "currentStaked",
    key: "currentStaked",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.totalStakedTokens,
      "Sum of all-time delegations to indexers including repeat delegations.",
    ),
    dataIndex: "totalStakedTokens",
    key: "totalStakedTokens",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.totalUnstakedTokens,
      "Sum of all-time undelegated GRTs from indexers.",
    ),
    dataIndex: "totalUnstakedTokens",
    key: "totalUnstakedTokens",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.activeStakesCount,
      "Current number of delegations.",
    ),
    dataIndex: "activeStakesCount",
    key: "activeStakesCount",
  },
  {
    title: createTitleWithTooltipDescription(
      titles.totalRealizedRewards,
      "The amount of <strong>already undelegated</strong> rewards from indexers.",
    ),
    dataIndex: "totalRealizedRewards",
    key: "totalRealizedRewards",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.unreleasedReward,
      "The amount of <strong>accumulated and not yet undelegated</strong> rewards from indexers.",
    ),
    dataIndex: "unreleasedReward",
    key: "unreleasedReward",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(titles.lastDelegatedAt),
    dataIndex: "lastDelegatedAt",
    key: "lastDelegatedAt",
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
];

export const transformToRow = ({
  id,
  totalStakedTokens,
  totalUnstakedTokens,
  activeStakesCount,
  lastDelegatedAt,
  lastUndelegatedAt,
  stakes,
}: Delegator): DelegatorsRow => {
  return {
    id,
    key: id,
    currentStaked: divideBy1e18(calcCurrentDelegation(stakes)),
    totalStakedTokens: divideBy1e18(totalStakedTokens),
    totalUnstakedTokens: divideBy1e18(totalUnstakedTokens),
    totalRealizedRewards: divideBy1e18(calcRealizedRewards(stakes)),
    unreleasedReward: divideBy1e18(calcUnrealizedRewards(stakes)),
    activeStakesCount,
    lastDelegatedAt: lastDelegatedAt[0]?.lastDelegatedAt ?? null,
    lastUndelegatedAt: lastUndelegatedAt[0]?.lastUndelegatedAt ?? null,
  };
};

export const transformToCsvRow = ({
  id,
  currentStaked,
  totalStakedTokens,
  totalUnstakedTokens,
  totalRealizedRewards,
  unreleasedReward,
  activeStakesCount,
  lastDelegatedAt,
  lastUndelegatedAt,
}: DelegatorsRow) => ({
  [titles.id]: id,
  [titles.currentStaked]: currentStaked,
  [titles.totalStakedTokens]: totalStakedTokens,
  [titles.totalUnstakedTokens]: totalUnstakedTokens,
  [titles.totalRealizedRewards]: totalRealizedRewards,
  [titles.unreleasedReward]: unreleasedReward,
  [titles.activeStakesCount]: activeStakesCount,
  [titles.lastDelegatedAt]: lastDelegatedAt
    ? formatTableDate(lastDelegatedAt)
    : null,
  [titles.lastUndelegatedAt]: lastUndelegatedAt
    ? formatTableDate(lastUndelegatedAt)
    : null,
});
