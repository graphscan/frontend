import { formatCardDate } from '../../../../../../utils/cards.utils';
import { divideBy1e18 } from '../../../../../../utils/number.utils';

export type SubgraphDetailsLite = {
  id: string;
  createdAt: number;
  subgraph: {
    id: string;
    creatorAddress: string | null;
    website: string | null;
    owner: {
      id: string;
    };
  };
  subgraphDeployment: {
    id: string;
    signalAmount: string;
    signalledTokens: string;
    queryFeesAmount: string;
    stakedTokens: string;
    indexingRewardAmount: string;
    network: { id: string } | null;
  };
};

export const transform = ({
  createdAt,
  subgraph: {
    id: subgraphId,
    creatorAddress,
    website,
    owner: { id: ownerId },
  },
  subgraphDeployment: {
    id: deploymentId,
    signalAmount,
    signalledTokens,
    queryFeesAmount,
    stakedTokens,
    indexingRewardAmount,
    network,
  },
}: SubgraphDetailsLite) => {
  return {
    id: subgraphId,
    network: network?.id ?? null,
    createdAt: formatCardDate(createdAt),
    creatorAddress,
    deploymentId,
    ownerId,
    website: website?.replace(/^https?\:\/\//i, '').split('/')[0] ?? null,
    signals: divideBy1e18(signalAmount),
    currentSignaled: divideBy1e18(signalledTokens),
    queryFeesAmount: divideBy1e18(queryFeesAmount),
    currentAllocations: divideBy1e18(stakedTokens),
    indexingRewards: divideBy1e18(indexingRewardAmount),
  };
};
