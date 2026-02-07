import { ColumnType } from "antd/es/table";
import { SubgraphStates } from "../../../../../../model/subgraph-states.model";
import { bs58encode } from "../../../../../../utils/bs58.utils";
import { divideBy1e18 } from "../../../../../../utils/number.utils";
import {
  calculateSubgraphProportion,
  isNewSubgraph,
} from "../../../../../../utils/subgraph.utils";
import {
  createTitleWithTooltipDescription,
  renderDeploymentId,
  renderSubgraphName,
  renderOwnerId,
  renderImage,
  renderDate,
  renderFormattedValue,
  formatTableDate,
  renderFixedValue,
} from "../../../../../../utils/table.utils";

export type Subgraph = {
  id: string;
  active: boolean;
  metadata: {
    image: string | null;
    displayName: string | null;
  } | null;
  owner: {
    id: string;
  };
  currentVersion: {
    id: string;
    createdAt: number;
    subgraphDeployment: {
      id: string;
      signalledTokens: string;
      stakedTokens: string;
      indexingRewardAmount: string;
      queryFeesAmount: string;
      deniedAt: number;
      manifest: {
        network: string | null;
      } | null;
      versions: Array<{
        id: string;
        subgraph: {
          id: string;
          currentVersion: {
            id: string;
            subgraphDeployment: { id: string };
          };
        };
      }>;
    };
  };
};

export type SubgraphsData = {
  subgraphs: Array<Subgraph>;
  totalTokensAllocated: string;
  totalTokensSignalled: string;
};

export type SubgraphsRow = SubgraphStates & {
  id: string;
  key: string;
  image: string | null;
  ownerId: string;
  displayName: string;
  deploymentId: string;
  createdAt: number;
  network: string | null;
  signalledTokens: number;
  stakedTokens: number;
  proportion: number;
  indexingRewardAmount: number;
  queryFeesAmount: number;
  versionId: string;
  favourite: boolean;
};

const titles: Record<
  Exclude<
    keyof SubgraphsRow,
    "id" | "versionId" | "key" | "favourite" | keyof SubgraphStates
  >,
  string
> = {
  image: "Img",
  displayName: "Name",
  ownerId: "Owner",
  createdAt: "Created",
  network: "Network",
  signalledTokens: "Current Signalled",
  stakedTokens: "Current Allocations",
  proportion: "Rewards Proportion",
  indexingRewardAmount: "Indexing Rewards",
  queryFeesAmount: "Query Fees Amount",
  deploymentId: "Deployment ID",
};

export const columnsWidth = {
  "2560": [48, 66, 230, 150, 215, 220, 198, 198, 198, 198, 198, 296],
  "1920": [48, 57, 192, 130, 192, 202, 115, 120, 115, 115, 115, 190],
  "1440": [48, 51, 168, 110, 168, 175, 104, 110, 104, 104, 104, 168],
  "1280": [48, 48, 150, 90, 150, 154, 90, 95, 90, 90, 90, 179],
};

export const columns: Array<ColumnType<SubgraphsRow>> = [
  {
    title: createTitleWithTooltipDescription(titles.image),
    dataIndex: "image",
    key: "image",
    fixed: "left",
    render: renderImage,
  },
  {
    title: createTitleWithTooltipDescription(titles.displayName),
    dataIndex: "displayName",
    key: "displayName",
    render: renderSubgraphName("versionId"),
    onCell: () => ({
      className: "ant-table-cell_with-link ant-table-cell_left-aligned",
    }),
  },
  {
    title: createTitleWithTooltipDescription(titles.network),
    dataIndex: "network",
    key: "network",
    align: "center",
  },
  {
    title: createTitleWithTooltipDescription(titles.ownerId),
    dataIndex: "ownerId",
    key: "ownerId",
    align: "center",
    onCell: () => ({ className: "ant-table-cell_with-link" }),
    render: renderOwnerId,
  },
  {
    title: createTitleWithTooltipDescription(titles.createdAt),
    dataIndex: "createdAt",
    key: "createdAt",
    align: "center",
    render: renderDate,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.signalledTokens,
      "Sum of GRT signaled by Curators to this subgraph.",
    ),
    dataIndex: "signalledTokens",
    key: "signalledTokens",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.stakedTokens,
      "Sum of GRT allocated by Indexers.",
    ),
    dataIndex: "stakedTokens",
    key: "stakedTokens",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.proportion,
      `
        Division of the ratio of subgraph signals to the total value of signals by the ratio of
        subgraph allocations to the total value of allocations.
      `,
    ),
    dataIndex: "proportion",
    key: "proportion",
    render: renderFixedValue(4),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.indexingRewardAmount,
      "The total indexing rewards earned by the indexers and their delegators from this subgraph.",
    ),
    dataIndex: "indexingRewardAmount",
    key: "indexingRewardAmount",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.queryFeesAmount,
      `
        The total fees that users have paid for queries from this indexers and their delegators from this 
        subgraph.
      `,
    ),
    dataIndex: "queryFeesAmount",
    key: "queryFeesAmount",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(titles.deploymentId),
    dataIndex: "deploymentId",
    key: "deploymentId",
    onCell: () => ({ className: "ant-table-cell_with-link" }),
    render: renderDeploymentId(),
  },
];

export const transformToRows =
  (favourites: Map<string, number>) =>
  ({
    subgraphs,
    totalTokensSignalled,
    totalTokensAllocated,
  }: SubgraphsData) => {
    const transformToRow = ({
      id,
      active,
      owner,
      metadata,
      currentVersion: {
        id: versionId,
        createdAt,
        subgraphDeployment: {
          id: deploymentId,
          signalledTokens,
          stakedTokens,
          indexingRewardAmount,
          queryFeesAmount,
          deniedAt,
          manifest,
          versions,
        },
      },
    }: Subgraph): SubgraphsRow => {
      const denied = deniedAt > 0;

      return {
        id,
        versionId,
        key: id,
        image: metadata?.image ?? null,
        ownerId: owner.id,
        deploymentId,
        createdAt,
        displayName: metadata?.displayName ?? "",
        network: manifest?.network ?? null,
        signalledTokens: divideBy1e18(signalledTokens),
        stakedTokens: divideBy1e18(stakedTokens),
        proportion: Number(stakedTokens)
          ? calculateSubgraphProportion({
              subgraphSignals: signalledTokens,
              subgraphAllocations: stakedTokens,
              totalSignals: totalTokensSignalled,
              totalAllocations: totalTokensAllocated,
            })
          : 0,
        queryFeesAmount: divideBy1e18(queryFeesAmount),
        indexingRewardAmount: divideBy1e18(indexingRewardAmount),
        favourite: favourites.has(id),
        denied,
        deprecated: !active,
        hasLinkedSubgraphs:
          !denied &&
          active &&
          versions.some(
            (x) =>
              x.subgraph.currentVersion &&
              x.subgraph.id !== id &&
              x.subgraph.currentVersion.subgraphDeployment.id === deploymentId,
          ),
        isNew: isNewSubgraph(createdAt),
      };
    };

    return subgraphs.map(transformToRow);
  };

export const transformToCsvRow = ({
  id,
  displayName,
  image,
  createdAt,
  network,
  signalledTokens,
  stakedTokens,
  proportion,
  indexingRewardAmount,
  queryFeesAmount,
  deploymentId,
}: SubgraphsRow) => ({
  [titles.image]: image,
  [titles.displayName]: displayName,
  [titles.ownerId]: id,
  [titles.createdAt]: formatTableDate(createdAt),
  [titles.network]: network,
  [titles.signalledTokens]: signalledTokens,
  [titles.stakedTokens]: stakedTokens,
  [titles.proportion]: proportion,
  [titles.indexingRewardAmount]: indexingRewardAmount,
  [titles.queryFeesAmount]: queryFeesAmount,
  [titles.deploymentId]: deploymentId,
  "Deployment ID (Qm view)": bs58encode(`1220${deploymentId.substring(2)}`),
});
