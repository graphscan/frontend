import {
  DelegatedStake,
  DelegatedStakeExtended,
} from "../model/delegators.model";

type CurrentDelegationStake = Pick<DelegatedStake, "shareAmount" | "indexer">;

export const calcStakeCurrentDelegation = ({
  shareAmount,
  indexer,
}: CurrentDelegationStake) => {
  return Number(shareAmount) * Number(indexer.delegationExchangeRate);
};

export const calcCurrentDelegation = (stakes: Array<CurrentDelegationStake>) =>
  stakes.reduce((acc, stake) => acc + calcStakeCurrentDelegation(stake), 0);

// Legacy unrealized rewards calculation (using realizedRewards from API)
export const calcStakeUnrealizedRewardsLegacy = ({
  shareAmount,
  stakedTokens,
  unstakedTokens,
  realizedRewards,
  indexer,
}: Omit<DelegatedStake, "id">) =>
  calcStakeCurrentDelegation({ shareAmount, indexer }) +
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
}: Pick<
  DelegatedStakeExtended,
  "shareAmount" | "personalExchangeRate" | "indexer"
>) =>
  (Number(indexer.delegationExchangeRate) - Number(personalExchangeRate)) *
  Number(shareAmount);

export const calcUnrealizedRewards = (
  stakes: Array<
    Pick<
      DelegatedStakeExtended,
      "shareAmount" | "personalExchangeRate" | "indexer"
    >
  >,
) => stakes.reduce((acc, stake) => acc + calcStakeUnrealizedRewards(stake), 0);

// Total Rewards = (unstaked + currentDelegation) - staked
export const calcStakeTotalRewards = (
  stake: Pick<
    DelegatedStake,
    "shareAmount" | "stakedTokens" | "unstakedTokens" | "indexer"
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
      "shareAmount" | "stakedTokens" | "unstakedTokens" | "indexer"
    >
  >,
) => stakes.reduce((acc, stake) => acc + calcStakeTotalRewards(stake), 0);

// Realized Rewards = Total Rewards - Unrealized Rewards
export const calcRealizedRewards = (stakes: Array<DelegatedStakeExtended>) =>
  calcTotalRewards(stakes) - calcUnrealizedRewards(stakes);
