import { ColumnType } from "antd/es/table";
import { SubgraphStates } from "../../../../../../model/subgraph-states.model";
import { divideBy1e18 } from "../../../../../../utils/number.utils";
import {
  calculateSubgraphProportion,
  isNewSubgraph,
} from "../../../../../../utils/subgraph.utils";
import {
  createTitleWithTooltipDescription,
  renderDeploymentId,
  renderSubgraphName,
  renderImage,
  renderDate,
  renderFormattedValue,
  formatTableDate,
  renderFixedValue,
} from "../../../../../../utils/table.utils";

type Version = {
  id: string;
  createdAt: number;
  subgraphDeployment: {
    id: string;
    signalledTokens: string;
    stakedTokens: string;
    indexingRewardAmount: string;
    queryFeesAmount: string;
    deniedAt: number;
    versions: Array<{
      id: string;
      subgraph: {
        id: string;
        currentVersion: {
          id: string;
        };
      };
      subgraphDeployment: {
        id: string;
      };
    }>;
  };
};

export type SubgraphOwnerSubgraph = {
  id: string;
  active: boolean;
  metadata: {
    image: string | null;
    displayName: string | null;
  } | null;
  currentVersion: Version | null;
  versions: Array<Version>;
};

export type SubgraphOwnerSubgraphsRow = SubgraphStates & {
  id: string;
  key: string;
  image: string | null;
  displayName: string | null;
  deploymentId: string;
  createdAt: number;
  signalledTokens: number;
  stakedTokens: number;
  proportion: number;
  indexingRewardAmount: number;
  queryFeesAmount: number;
  versionId: string;
};

const titles: Record<
  Exclude<
    keyof SubgraphOwnerSubgraphsRow,
    "key" | "versionId" | keyof SubgraphStates
  >,
  string
> = {
  id: "ID",
  image: "Img",
  displayName: "Name",
  createdAt: "Created",
  signalledTokens: "Current Signalled",
  stakedTokens: "Current Allocations",
  proportion: "Rewards Proportion",
  indexingRewardAmount: "Indexing Rewards",
  queryFeesAmount: "Query Fees Amount",
  deploymentId: "Deployment ID",
};

export const columnsWidth = {
  "2560": [66, 66, 359, 220, 192, 192, 192, 192, 192, 394],
  "1920": [58, 58, 270, 202, 124, 124, 124, 124, 124, 232],
  "1440": [51, 51, 230, 175, 100, 100, 100, 100, 100, 273],
  "1280": [48, 48, 226, 154, 90, 90, 90, 90, 90, 258],
};

export const columns: Array<ColumnType<SubgraphOwnerSubgraphsRow>> = [
  {
    title: createTitleWithTooltipDescription(titles.id),
    dataIndex: "id",
    key: "id",
    align: "center",
    fixed: "left",
    render: (_, row) => row.versionId.split("-")[1],
  },
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
    align: "center",
    render: renderSubgraphName("versionId"),
    onCell: () => ({ className: "ant-table-cell_with-link" }),
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

export const transformToRows = ({
  subgraphs,
  totalTokensAllocated,
  totalTokensSignalled,
}: {
  subgraphs: Array<SubgraphOwnerSubgraph>;
  totalTokensAllocated: string;
  totalTokensSignalled: string;
}) => {
  const transformToRow = ({
    id,
    active,
    metadata,
    currentVersion,
    versions,
  }: SubgraphOwnerSubgraph): SubgraphOwnerSubgraphsRow => {
    const {
      id: versionId,
      createdAt,
      subgraphDeployment: {
        id: deploymentId,
        signalledTokens,
        stakedTokens,
        queryFeesAmount,
        indexingRewardAmount,
        deniedAt,
        versions: deploymentVersions,
      },
    } = currentVersion ?? versions.sort((a, b) => b.createdAt - a.createdAt)[0];
    const denied = deniedAt > 0;

    return {
      id,
      key: id,
      image: metadata?.image ?? null,
      deploymentId,
      createdAt,
      displayName: metadata?.displayName ?? null,
      signalledTokens: divideBy1e18(signalledTokens),
      stakedTokens: divideBy1e18(stakedTokens),
      proportion: Number(stakedTokens)
        ? calculateSubgraphProportion({
            subgraphAllocations: stakedTokens,
            subgraphSignals: signalledTokens,
            totalAllocations: totalTokensAllocated,
            totalSignals: totalTokensSignalled,
          })
        : 0,
      queryFeesAmount: divideBy1e18(queryFeesAmount),
      indexingRewardAmount: divideBy1e18(indexingRewardAmount),
      deprecated: !active || !currentVersion || currentVersion.id !== versionId,
      denied,
      hasLinkedSubgraphs:
        !denied && currentVersion && active
          ? deploymentVersions.some(
              (x) =>
                x.subgraph.currentVersion &&
                x.subgraph.id !== id &&
                x.subgraphDeployment.id === deploymentId,
            )
          : false,
      versionId,
      isNew: isNewSubgraph(createdAt),
    };
  };

  return subgraphs.map(transformToRow);
};

export const transformToCsvRow = ({
  displayName,
  image,
  createdAt,
  signalledTokens,
  stakedTokens,
  proportion,
  indexingRewardAmount,
  queryFeesAmount,
  deploymentId,
}: SubgraphOwnerSubgraphsRow) => ({
  [titles.image]: image,
  [titles.displayName]: displayName,
  [titles.createdAt]: formatTableDate(createdAt),
  [titles.signalledTokens]: signalledTokens,
  [titles.stakedTokens]: stakedTokens,
  [titles.stakedTokens]: proportion,
  [titles.indexingRewardAmount]: indexingRewardAmount,
  [titles.queryFeesAmount]: queryFeesAmount,
  [titles.deploymentId]: deploymentId,
});
