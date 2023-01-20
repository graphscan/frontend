import { GraphNetwork, getInflationPerDay } from '../../../../model/graph-network.model';
import { divideBy1e18 } from '../../../../utils/number.utils';

type NetworkStatsData = {
  totalSupply: number;
  totalGRTMinted: number;
  totalGRTBurned: number;
  dailyIssuance: number;
  totalTokensStaked: number;
  totalDelegatedTokens: number;
  totalTokensAllocated: number;
  totalTokensSignalled: number;
  indexerCount: number;
  delegatorCount: number;
  subgraphCount: number;
  curatorCount: number;
  totalIndexingRewards: number;
  totalIndexingDelegatorRewards: number;
  totalIndexingIndexerRewards: number;
  totalQueryFees: number;
  currentEpoch: number;
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

export const transformGraphNetworkToStats = ({
  totalSupply,
  totalGRTMinted,
  totalGRTBurned,
  networkGRTIssuance,
  totalTokensStaked,
  totalDelegatedTokens,
  totalTokensAllocated,
  totalTokensSignalled,
  indexerCount,
  delegatorCount,
  curatorCount,
  totalIndexingRewards,
  totalIndexingDelegatorRewards,
  totalIndexingIndexerRewards,
  totalQueryFees,
  currentEpoch,
  arbitrator,
  controller,
  curation,
  gns,
  governor,
  graphToken,
  rewardsManager,
  serviceRegistry,
  staking,
  epochManager,
  subgraphCount,
}: GraphNetwork): NetworkStatsData => ({
  totalSupply: divideBy1e18(totalSupply),
  totalGRTMinted: divideBy1e18(totalGRTMinted),
  totalGRTBurned: divideBy1e18(totalGRTBurned),
  dailyIssuance: divideBy1e18(getInflationPerDay({ totalSupply, networkGRTIssuance })),
  totalTokensStaked: divideBy1e18(totalTokensStaked),
  totalDelegatedTokens: divideBy1e18(totalDelegatedTokens),
  totalTokensAllocated: divideBy1e18(totalTokensAllocated),
  totalTokensSignalled: divideBy1e18(totalTokensSignalled),
  indexerCount,
  delegatorCount,
  subgraphCount,
  curatorCount,
  totalIndexingRewards: divideBy1e18(totalIndexingRewards),
  totalIndexingDelegatorRewards: divideBy1e18(totalIndexingDelegatorRewards),
  totalIndexingIndexerRewards: divideBy1e18(totalIndexingIndexerRewards),
  totalQueryFees: divideBy1e18(totalQueryFees),
  currentEpoch,
  arbitrator,
  controller,
  curation,
  gns,
  governor,
  graphToken,
  rewardsManager,
  serviceRegistry,
  staking,
  epochManager,
});
