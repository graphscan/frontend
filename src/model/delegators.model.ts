export type DelegationPool = {
  delegatorShares: string;
  delegationExchangeRate: string;
};

export type DelegationPoolSource = {
  provision: (DelegationPool & { id: string }) | null;
  indexer: DelegationPool;
};

export type DelegatedStake = DelegationPoolSource & {
  id: string;
  shareAmount: string;
  stakedTokens: string;
  unstakedTokens: string;
  realizedRewards: string;
  indexer: {
    id: string;
    delegatedTokens: string;
    delegatorShares: string;
    delegatedThawingTokens: string;
  };
};

export type DelegatedStakeExtended = DelegatedStake & {
  personalExchangeRate: string;
};
