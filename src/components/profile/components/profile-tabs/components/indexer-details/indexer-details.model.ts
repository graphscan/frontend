import { decodeGeohash } from '../../../../../../utils/geohash.utils';
import { divideBy1e18, divideBy1e6 } from '../../../../../../utils/number.utils';

export type IndexerDetails = {
  id: string;
  allocatedTokens: string;
  delegatorIndexingRewards: string;
  delegatorQueryFees: string;
  geoHash: string | null;
  indexerIndexingRewards: string;
  indexerQueryFees: string;
  indexingRewardEffectiveCut: string;
  indexingRewardCut: number;
  queryFeeEffectiveCut: string;
  queryFeeCut: number;
  stakedTokens: string;
  lockedTokens: string;
  delegatedTokens: string;
};

export const transform = ({
  indexingRewardEffectiveCut,
  indexingRewardCut,
  queryFeeEffectiveCut,
  queryFeeCut,
  allocatedTokens: _allocatedTokens,
  delegatedTokens: _delegatedTokens,
  stakedTokens: _stakedTokens,
  lockedTokens: _lockedTokens,
  delegatorIndexingRewards,
  delegatorQueryFees,
  indexerIndexingRewards,
  indexerQueryFees,
  geoHash,
}: IndexerDetails) => {
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
    queryFeeCut: divideBy1e6(queryFeeCut),
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
    indexerQueryFees: divideBy1e18(indexerQueryFees),
    location: geoHash ? decodeGeohash(geoHash) : null,
  };
};
