import { decodeGeohash } from '../../../../../../utils/geohash.utils';
import { divideBy1e18, divideBy1e6 } from '../../../../../../utils/number.utils';

export type IndexerDetailsLite = {
  id: string;
  allocatedTokens: string;
  delegatorIndexingRewards: string;
  delegatorQueryFees: string;
  geoHash: string | null;
  indexerIndexingRewards: string;
  indexingRewardEffectiveCut: string;
  indexingRewardCut: number;
  queryFeeEffectiveCut: string;
  queryFeesCollected: string;
  queryFeeCut: number;
  queryFeeRebates: string;
  stakedTokens: string;
  lockedTokens: string;
  delegatedTokens: string;
};

export const transform = ({
  indexingRewardEffectiveCut,
  indexingRewardCut,
  queryFeeEffectiveCut,
  queryFeesCollected,
  queryFeeCut,
  queryFeeRebates,
  allocatedTokens: _allocatedTokens,
  delegatedTokens: _delegatedTokens,
  stakedTokens: _stakedTokens,
  lockedTokens: _lockedTokens,
  delegatorIndexingRewards,
  delegatorQueryFees,
  indexerIndexingRewards,
  geoHash,
}: IndexerDetailsLite) => {
  const stackedTokens = divideBy1e18(_stakedTokens);
  const lockedTokens = divideBy1e18(_lockedTokens);
  const selfStaked = stackedTokens - lockedTokens;
  const delegatedTokens = divideBy1e18(_delegatedTokens);
  const delegationRemaining = selfStaked * 16 - delegatedTokens;
  const allocatedTokens = divideBy1e18(_allocatedTokens);

  return {
    indexingRewardEffectiveCut: Number(indexingRewardEffectiveCut),
    indexingRewardCut: divideBy1e6(indexingRewardCut),
    queryFeeEffectiveCut: Number(queryFeeEffectiveCut),
    queryFeesCollected: divideBy1e18(queryFeesCollected),
    queryFeeCut: divideBy1e6(queryFeeCut),
    queryFeeRebates: divideBy1e18(queryFeeRebates),
    allocatedTokens,
    notAllocatedTokens:
      selfStaked + delegatedTokens + (delegationRemaining < 0 ? delegationRemaining : 0) - allocatedTokens,
    lockedTokens,
    selfStaked,
    delegatedTokens,
    delegationRemaining,
    delegatorIndexingRewards: divideBy1e18(delegatorIndexingRewards),
    delegatorQueryFees: divideBy1e18(delegatorQueryFees),
    indexerIndexingRewards: divideBy1e18(indexerIndexingRewards),
    location: geoHash ? decodeGeohash(geoHash) : null,
  };
};
