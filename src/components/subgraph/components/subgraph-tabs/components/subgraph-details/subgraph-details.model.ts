import { formatCardDate } from '../../../../../../utils/cards.utils';
import { divideBy1e18 } from '../../../../../../utils/number.utils';

export type SubgraphDetails = {
  id: string;
  createdAt: number;
  subgraph: {
    id: string;
    creatorAddress: string | null;
    metadata: {
      website: string | null;
    } | null;
    owner: {
      id: string;
    };
  };
  subgraphDeployment: {
    id: string;
    signalAmount: string;
    signalledTokens: string;
    queryFeesAmount: string;
    indexersCount: number;
    stakedTokens: string;
    indexingRewardAmount: string;
    metadata: {
      network: string | null;
    } | null;
  };
};

export const transform = ({
  createdAt,
  subgraph: {
    id: subgraphId,
    creatorAddress,
    metadata,
    owner: { id: ownerId },
  },
  subgraphDeployment: {
    id: deploymentId,
    signalAmount,
    signalledTokens,
    queryFeesAmount,
    indexersCount,
    stakedTokens,
    indexingRewardAmount,
    metadata: deploymentMetadata,
  },
}: SubgraphDetails) => {
  return {
    id: subgraphId,
    network: deploymentMetadata?.network ?? null,
    createdAt: formatCardDate(createdAt),
    creatorAddress,
    deploymentId,
    ownerId,
    website: metadata?.website?.replace(/^https?\:\/\//i, '').split('/')[0] ?? null,
    signals: divideBy1e18(signalAmount),
    currentSignaled: divideBy1e18(signalledTokens),
    queryFeesAmount: divideBy1e18(queryFeesAmount),
    indexers: indexersCount,
    currentAllocations: divideBy1e18(stakedTokens),
    indexingRewards: divideBy1e18(indexingRewardAmount),
  };
};
