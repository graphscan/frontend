import {
  DelegatedStake,
  DelegatedStakeExtended,
  DelegationPoolSource,
} from "../model/delegators.model";

type CurrentDelegationStake = Pick<
  DelegatedStake,
  "shareAmount" | "indexer" | "provision"
>;

// Horizon shares belong to a provision; legacy stakes use the indexer's pool.
export const getDelegationPool = ({
  provision,
  indexer,
}: DelegationPoolSource) => provision ?? indexer;

export const calcStakeCurrentDelegation = (stake: CurrentDelegationStake) =>
  Number(stake.shareAmount) *
  Number(getDelegationPool(stake).delegationExchangeRate);

export const calcCurrentDelegation = (stakes: Array<CurrentDelegationStake>) =>
  stakes.reduce((acc, stake) => acc + calcStakeCurrentDelegation(stake), 0);

// Legacy unrealized rewards calculation (using realizedRewards from API)
export const calcStakeUnrealizedRewardsLegacy = ({
  shareAmount,
  stakedTokens,
  unstakedTokens,
  realizedRewards,
  indexer,
  provision,
}: Omit<DelegatedStake, "id">) =>
  calcStakeCurrentDelegation({ shareAmount, indexer, provision }) +
  (Number(unstakedTokens) - Number(realizedRewards)) -
  Number(stakedTokens);

export const calcUnrealizedRewardsLegacy = (stakes: Array<DelegatedStake>) =>
  stakes.reduce(
    (acc, stake) => acc + calcStakeUnrealizedRewardsLegacy(stake),
    0,
  );

// New unrealized rewards calculation: (delegationExchangeRate - personalExchangeRate) * shareAmount
export const calcStakeUnrealizedRewards = ({
  shareAmount,
  personalExchangeRate,
  indexer,
  provision,
}: Pick<
  DelegatedStakeExtended,
  "shareAmount" | "personalExchangeRate" | "indexer" | "provision"
>) =>
  (Number(getDelegationPool({ indexer, provision }).delegationExchangeRate) -
    Number(personalExchangeRate)) *
  Number(shareAmount);

export const calcUnrealizedRewards = (
  stakes: Array<
    Pick<
      DelegatedStakeExtended,
      "shareAmount" | "personalExchangeRate" | "indexer" | "provision"
    >
  >,
) => stakes.reduce((acc, stake) => acc + calcStakeUnrealizedRewards(stake), 0);

// Total Rewards = (unstaked + currentDelegation) - staked
export const calcStakeTotalRewards = (
  stake: Pick<
    DelegatedStake,
    "shareAmount" | "stakedTokens" | "unstakedTokens" | "indexer" | "provision"
  >,
) => {
  const currentDelegation = calcStakeCurrentDelegation(stake);
  return (
    currentDelegation +
    Number(stake.unstakedTokens) -
    Number(stake.stakedTokens)
  );
};

export const calcTotalRewards = (
  stakes: Array<
    Pick<
      DelegatedStake,
      | "shareAmount"
      | "stakedTokens"
      | "unstakedTokens"
      | "indexer"
      | "provision"
    >
  >,
) => stakes.reduce((acc, stake) => acc + calcStakeTotalRewards(stake), 0);

// Realized Rewards = Total Rewards - Unrealized Rewards
export const calcRealizedRewards = (stakes: Array<DelegatedStakeExtended>) =>
  calcTotalRewards(stakes) - calcUnrealizedRewards(stakes);
