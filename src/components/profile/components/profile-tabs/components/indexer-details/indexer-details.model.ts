import { decodeGeohash } from "../../../../../../utils/geohash.utils";
import {
  divideBy1e18,
  divideBy1e6,
} from "../../../../../../utils/number.utils";

export type IndexerDetails = {
  id: string;
  allocatedTokens: string;
  delegatorIndexingRewards: string;
  delegatorQueryFees: string;
  geoHash: string | null;
  indexerIndexingRewards: string;
  queryFeesCollected: string;
  queryFeeRebates: string;
  indexingRewardCut: number;
  queryFeeCut: number;
  ownStakeRatio: string;
  stakedTokens: string;
  lockedTokens: string;
  delegatedTokens: string;
};

export const transform = ({
  indexingRewardCut: _indexingRewardCut,
  queryFeeCut: _queryFeeCut,
  ownStakeRatio: _ownStakeRatio,
  allocatedTokens: _allocatedTokens,
  delegatedTokens: _delegatedTokens,
  stakedTokens: _stakedTokens,
  lockedTokens: _lockedTokens,
  delegatorIndexingRewards,
  delegatorQueryFees,
  indexerIndexingRewards,
  queryFeesCollected,
  queryFeeRebates,
  geoHash,
}: IndexerDetails) => {
  const stackedTokens = divideBy1e18(_stakedTokens);
  const lockedTokens = divideBy1e18(_lockedTokens);
  const selfStaked = stackedTokens - lockedTokens;
  const delegatedTokens = divideBy1e18(_delegatedTokens);
  const delegationRemaining = selfStaked * 16 - delegatedTokens;
  const allocatedTokens = divideBy1e18(_allocatedTokens);

  const indexingRewardCut = divideBy1e6(_indexingRewardCut);
  const queryFeeCut = divideBy1e6(_queryFeeCut);
  const ownStakeRatio = Number(_ownStakeRatio);

  // Calculate effective cuts using ownStakeRatio from API
  // Formula: 1 - (1 - cut) / (1 - ownStakeRatio)
  const indexingRewardEffectiveCut =
    delegatedTokens > 0 && ownStakeRatio < 1
      ? 1 - (1 - indexingRewardCut) / (1 - ownStakeRatio)
      : null;
  const queryFeeEffectiveCut =
    delegatedTokens > 0 && ownStakeRatio < 1
      ? 1 - (1 - queryFeeCut) / (1 - ownStakeRatio)
      : null;

  return {
    indexingRewardEffectiveCut,
    indexingRewardCut,
    queryFeeEffectiveCut,
    queryFeeCut,
    allocatedTokens,
    notAllocatedTokens:
      selfStaked +
      delegatedTokens +
      (delegationRemaining < 0 ? delegationRemaining : 0) -
      allocatedTokens,
    lockedTokens,
    selfStaked,
    delegatedTokens,
    delegationRemaining,
    delegatorIndexingRewards: divideBy1e18(delegatorIndexingRewards),
    delegatorQueryFees: divideBy1e18(delegatorQueryFees),
    indexerIndexingRewards: divideBy1e18(indexerIndexingRewards),
    queryFeesCollected: divideBy1e18(queryFeesCollected),
    queryFeeRebates: divideBy1e18(queryFeeRebates),
    location: geoHash ? decodeGeohash(geoHash) : null,
  };
};
