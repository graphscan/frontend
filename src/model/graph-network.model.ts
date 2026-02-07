export type ProtocolContracts = {
  arbitrator: string;
  controller: string;
  curation: string;
  gns: string;
  governor: string;
  graphToken: string;
  rewardsManager: string;
  serviceRegistry: string;
  staking: string;
  epochManager: string;
};

export type GraphNetwork = {
  id: string;
  indexerCount: number;
  delegatorCount: number;
  curatorCount: number;
  subgraphCount: number;
  currentEpoch: number;
  networkGRTIssuance: string;
  networkGRTIssuancePerBlock: string;
  totalGRTMinted: string;
  totalSupply: string;
  totalGRTBurned: string;
  totalTokensStaked: string;
  totalDelegatedTokens: string;
  totalTokensAllocated: string;
  totalTokensClaimable: string;
  totalQueryFees: string;
  totalIndexingRewards: string;
  totalIndexingDelegatorRewards: string;
  totalIndexingIndexerRewards: string;
  totalTokensSignalled: string;
} & ProtocolContracts;
