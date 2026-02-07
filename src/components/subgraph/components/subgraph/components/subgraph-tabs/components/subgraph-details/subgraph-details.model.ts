import { formatCardDate } from "../../../../../../../../utils/cards.utils";
import { divideBy1e18 } from "../../../../../../../../utils/number.utils";

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
    stakedTokens: string;
    indexingRewardAmount: string;
    indexerAllocations: Array<{
      indexer: {
        id: string;
      };
    }>;
    manifest: {
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
    stakedTokens,
    indexingRewardAmount,
    indexerAllocations,
    manifest,
  },
}: SubgraphDetails) => {
  const uniqueIndexersCount = new Set(
    indexerAllocations.map((a) => a.indexer.id),
  ).size;

  return {
    id: subgraphId,
    network: manifest?.network ?? null,
    createdAt: formatCardDate(createdAt),
    creatorAddress,
    deploymentId,
    ownerId,
    website:
      metadata?.website?.replace(/^https?\:\/\//i, "").split("/")[0] ?? null,
    signals: divideBy1e18(signalAmount),
    currentSignaled: divideBy1e18(signalledTokens),
    queryFeesAmount: divideBy1e18(queryFeesAmount),
    indexers: uniqueIndexersCount,
    currentAllocations: divideBy1e18(stakedTokens),
    indexingRewards: divideBy1e18(indexingRewardAmount),
  };
};
