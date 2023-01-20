import { GraphNetwork } from '../../../../../../model/graph-network.model';
import { getEstimatedRewards } from '../../../../../../model/indexers.model';
import { divideBy1e18, divideBy1e6 } from '../../../../../../utils/number.utils';

export type IndexerData = {
  id: string;
  indexingRewardCut: number;
  indexingRewardEffectiveCut: string;
  queryFeeEffectiveCut: string;
  stakedTokens: string;
  lockedTokens: string;
  delegatedTokens: string;
  allocatedTokens: string;
  allocations: Array<{
    id: string;
    allocatedTokens: string;
    subgraphDeployment: {
      id: string;
      signalledTokens: string;
      stakedTokens: string;
      deniedAt: number;
    };
  }>;
};

export const transform = ({
  indexerData: {
    indexingRewardEffectiveCut,
    queryFeeEffectiveCut,
    delegatedTokens,
    stakedTokens,
    lockedTokens,
    indexingRewardCut: _indexingRewardCut,
    allocatedTokens,
    allocations,
  },
  networkData: { networkGRTIssuance, totalSupply, totalTokensSignalled },
}: {
  indexerData: IndexerData;
  networkData: GraphNetwork;
}) => {
  const delegations = divideBy1e18(delegatedTokens);
  const delegationRemaining = (divideBy1e18(stakedTokens) - divideBy1e18(lockedTokens)) * 16 - delegations;

  const getEstimatedApr = (futureDelegation: string) => {
    const indexingRewardCut = divideBy1e6(_indexingRewardCut);
    const { estFuturePercentReward } = getEstimatedRewards({
      delegations,
      delegationRemaining,
      indexingRewardCut,
      allocatedTokens,
      futureDelegation,
      networkData: { networkGRTIssuance, totalSupply, totalTokensSignalled },
      allocations,
    });

    return estFuturePercentReward * 36500;
  };

  return {
    effectiveIndexingRewardFeeCut: Number(indexingRewardEffectiveCut),
    effectiveQueryFeeCut: Number(queryFeeEffectiveCut),
    delegationPool: delegations,
    maxCapacity: delegationRemaining,
    getEstimatedApr,
  };
};
