import { SubgraphStates } from './subgraph-states.model';

export type LinkedSubgraphsRow = SubgraphStates & {
  id: string;
  key: string;
  img: string;
  displayName: string;
  ownerId: string;
  deploymentId: string;
  createdAt: number;
  versionId: string;
};
