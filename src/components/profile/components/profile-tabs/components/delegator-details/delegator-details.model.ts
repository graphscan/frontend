import { formatTableDate } from "../../../../../../utils/table.utils";
import { divideBy1e18 } from "../../../../../../utils/number.utils";
import {
  calcCurrentDelegation,
  calcTotalRewards,
  calcUnrealizedRewards,
} from "../../../../../../utils/delegators.utils";

type DelegatorDetailsStake = {
  id: string;
  shareAmount: string;
  personalExchangeRate: string;
  stakedTokens: string;
  unstakedTokens: string;
  lastDelegatedAt: number | null;
  lastUndelegatedAt: number | null;
  indexer: {
    id: string;
    delegatedTokens: string;
    delegatorShares: string;
    delegationExchangeRate: string;
  };
};

export type DelegatorDetails = {
  id: string;
  activeStakesCount: number;
  totalStakedTokens: string;
  totalUnstakedTokens: string;
  stakes: Array<DelegatorDetailsStake>;
};

const getLatestDate = (
  stakes: Array<DelegatorDetailsStake>,
  field: "lastDelegatedAt" | "lastUndelegatedAt",
): number | null => {
  const dates = stakes
    .map((s) => s[field])
    .filter((d): d is number => d !== null);
  return dates.length > 0 ? Math.max(...dates) : null;
};

export const transformDelegatorDetails = ({
  activeStakesCount,
  totalStakedTokens,
  totalUnstakedTokens,
  stakes,
}: DelegatorDetails) => {
  const currentDelegations = divideBy1e18(calcCurrentDelegation(stakes));

  // Total Rewards = sum of (currentDelegation_i + unstakedTokens_i - stakedTokens_i) per stake
  const totalRewards = divideBy1e18(calcTotalRewards(stakes));

  // Unrealized Rewards = sum of (delegationExchangeRate - personalExchangeRate) * shareAmount per stake
  const unrealizedRewards = divideBy1e18(calcUnrealizedRewards(stakes));

  // Realized Rewards = Total Rewards - Unrealized Rewards
  const realizedRewards = totalRewards - unrealizedRewards;

  // Derive lastDelegatedAt / lastUndelegatedAt from stakes (latest across all)
  const lastDelegatedAt = getLatestDate(stakes, "lastDelegatedAt");
  const lastUndelegatedAt = getLatestDate(stakes, "lastUndelegatedAt");

  return {
    delegationsCount: activeStakesCount,
    currentDelegations,
    delegatedTotal: divideBy1e18(totalStakedTokens),
    undelegatedTotal: divideBy1e18(totalUnstakedTokens),
    totalRewards,
    realizedRewards,
    unrealizedRewards,
    unrealizedPercent:
      currentDelegations === 0 ? 0 : unrealizedRewards / currentDelegations,
    lastDelegation: lastDelegatedAt ? formatTableDate(lastDelegatedAt) : null,
    lastUndelegation: lastUndelegatedAt
      ? formatTableDate(lastUndelegatedAt)
      : null,
  };
};
