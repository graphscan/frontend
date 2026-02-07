import { LinkedSubgraphsRow } from "../../../../model/linked-subgraphs.model";
import { formatCardDate } from "../../../../utils/cards.utils";
import { divideBy1e18 } from "../../../../utils/number.utils";
import { isNewSubgraph } from "../../../../utils/subgraph.utils";

export type SubgraphVersion = {
  id: string;
  createdAt: number;
  subgraph: {
    id: string;
    active: boolean;
    creatorAddress: string | null;
    metadata: {
      displayName: string | null;
      image: string | null;
      description: string | null;
    } | null;
    owner: {
      id: string;
    };
    currentVersion: {
      id: string;
      subgraphDeployment: {
        id: string;
        versions: Array<{
          id: string;
          subgraph: {
            id: string;
            metadata: {
              image: string;
              displayName: string;
            } | null;
            owner: {
              id: string;
            };
            currentVersion: {
              id: string;
              createdAt: number;
              subgraphDeployment: {
                id: string;
                deniedAt: number;
              };
            } | null;
          };
        }>;
      };
    } | null;
    versions: Array<{
      id: string;
      metadata: {
        label: string | null;
      } | null;
    }>;
  };
  subgraphDeployment: {
    id: string;
    signalledTokens: string;
    stakedTokens: string;
    deniedAt: number;
  };
};

export const transform = ({
  id: versionId,
  createdAt,
  subgraph: {
    id: subgraphId,
    active,
    metadata,
    owner: { id: ownerId },
    currentVersion,
    versions,
  },
  subgraphDeployment: {
    id: deploymentId,
    signalledTokens,
    stakedTokens,
    deniedAt,
  },
}: SubgraphVersion) => {
  const deprecated = versionId !== currentVersion?.id || !active;
  const denied = deniedAt > 0;
  const isValidSubgraph = !(deprecated || denied);
  const versionsOptions = versions.map(({ id, metadata }) => ({
    value: id,
    label: metadata?.label && metadata?.label.length > 0 ? metadata.label : id,
  }));
  const linkedSubgraphs = isValidSubgraph
    ? currentVersion?.subgraphDeployment.versions.reduce<
        Array<LinkedSubgraphsRow>
      >((acc, val) => {
        return val.subgraph.currentVersion &&
          val.subgraph.id !== subgraphId &&
          val.subgraph.currentVersion.subgraphDeployment.id === deploymentId
          ? [
              ...acc,
              {
                id: val.subgraph.id,
                versionId: val.subgraph.currentVersion.id,
                key: val.subgraph.id,
                img: val.subgraph.metadata?.image ?? null,
                ownerId: val.subgraph.owner.id,
                displayName: val.subgraph.metadata?.displayName ?? "",
                createdAt: val.subgraph.currentVersion.createdAt,
                deploymentId: val.subgraph.currentVersion.subgraphDeployment.id,
                deprecated: false,
                denied: false,
                hasLinkedSubgraphs: false,
                isNew: isNewSubgraph(val.subgraph.currentVersion.createdAt),
              },
            ]
          : acc;
      }, [])
    : null;

  return {
    accountCardData: {
      id: subgraphId,
      displayName: metadata?.displayName ?? "",
      image: metadata?.image ?? null,
      ownerId,
      createdAt: formatCardDate(createdAt),
      hasLinkedSubgraphs: Boolean(
        linkedSubgraphs && linkedSubgraphs.length > 0,
      ),
      deprecated,
      denied,
      versionId,
      versionsOptions,
      isNew: isValidSubgraph && isNewSubgraph(createdAt),
    },
    descriptionCardData: {
      description: metadata?.description ?? null,
      signalledTokens: divideBy1e18(signalledTokens),
      allocated: divideBy1e18(stakedTokens),
      deprecated,
    },
    tabsData: {
      subgraphId,
      deploymentId,
      linkedSubgraphs:
        linkedSubgraphs && linkedSubgraphs.length > 0 ? linkedSubgraphs : null,
      linkedSubgraphsIds:
        linkedSubgraphs && linkedSubgraphs.length > 0 && currentVersion
          ? linkedSubgraphs.map((x) => x.id).sort()
          : null,
    },
  };
};
