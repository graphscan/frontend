import { decodeGeohash } from "../../../../../../utils/geohash.utils";
import {
  divideBy1e18,
  divideBy1e6,
} from "../../../../../../utils/number.utils";

export type IndexerDetails = {
  id: string;
  availableStake: string;
  allocatedTokens: string;
  delegatorIndexingRewards: string;
  delegatorQueryFees: string;
  delegatedThawingTokens: string;
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
  delegatedCapacity: string;
};

export const transform = ({
  indexingRewardCut: _indexingRewardCut,
  queryFeeCut: _queryFeeCut,
  ownStakeRatio: _ownStakeRatio,
  availableStake: _availableStake,
  allocatedTokens: _allocatedTokens,
  delegatedTokens: _delegatedTokens,
  delegatedCapacity: _delegatedCapacity,
  stakedTokens: _stakedTokens,
  lockedTokens: _lockedTokens,
  delegatorIndexingRewards,
  delegatorQueryFees,
  delegatedThawingTokens: _delegatedThawingTokens,
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
    notAllocatedTokens: divideBy1e18(_availableStake),
    lockedTokens,
    selfStaked,
    delegatedTokens,
    delegatedCapacity: divideBy1e18(_delegatedCapacity),
    delegationRemaining,
    delegatorIndexingRewards: divideBy1e18(delegatorIndexingRewards),
    delegatorQueryFees: divideBy1e18(delegatorQueryFees),
    delegatedThawingTokens: divideBy1e18(_delegatedThawingTokens),
    indexerIndexingRewards: divideBy1e18(indexerIndexingRewards),
    queryFeesCollected: divideBy1e18(queryFeesCollected),
    queryFeeRebates: divideBy1e18(queryFeeRebates),
    location: geoHash ? decodeGeohash(geoHash) : null,
  };
};
