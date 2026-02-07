export type DelegatedStake = {
  id: string;
  shareAmount: string;
  stakedTokens: string;
  unstakedTokens: string;
  realizedRewards: string;
  indexer: {
    id: string;
    delegatedTokens: string;
    delegatorShares: string;
    delegationExchangeRate: string;
  };
};

export type DelegatedStakeExtended = DelegatedStake & {
  personalExchangeRate: string;
};
