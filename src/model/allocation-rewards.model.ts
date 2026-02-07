export type PotentialRewards = {
  potentialIndexerRewards: number;
  potentialDelegatorRewards: number;
};

export type AllocationsRewards = Record<string, PotentialRewards>;
