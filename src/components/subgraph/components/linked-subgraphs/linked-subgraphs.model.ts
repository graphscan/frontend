import { ColumnType } from "antd/es/table";
import { LinkedSubgraphsRow } from "../../../../model/linked-subgraphs.model";
import { SubgraphStates } from "../../../../model/subgraph-states.model";
import {
  createTitleWithTooltipDescription,
  renderDeploymentId,
  renderOwnerId,
  renderSubgraphName,
  renderImage,
  renderDate,
  formatTableDate,
} from "../../../../utils/table.utils";

const titles: Record<
  Exclude<
    keyof LinkedSubgraphsRow,
    "id" | "versionId" | "key" | keyof SubgraphStates
  >,
  string
> = {
  img: "Img",
  displayName: "Name",
  ownerId: "Owner",
  createdAt: "Created",
  deploymentId: "Deployment ID",
};

export const columnsWidth = {
  "2560": [66, 500, 500, 500, 499],
  "1920": [57, 346, 346, 346, 345],
  "1440": [51, 308, 307, 307, 307],
  "1280": [48, 284, 284, 284, 284],
};

export const columns: Array<ColumnType<LinkedSubgraphsRow>> = [
  {
    title: createTitleWithTooltipDescription(titles.img),
    dataIndex: "img",
    key: "img",
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
    title: createTitleWithTooltipDescription(titles.ownerId),
    dataIndex: "ownerId",
    key: "ownerId",
    align: "center",
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
    title: createTitleWithTooltipDescription(titles.deploymentId),
    dataIndex: "deploymentId",
    key: "deploymentId",
    onCell: () => ({ className: "ant-table-cell_with-link" }),
    render: renderDeploymentId(),
  },
];

export const transformToCsvRow = ({
  id,
  displayName,
  img,
  createdAt,
  deploymentId,
}: LinkedSubgraphsRow) => ({
  [titles.img]: img,
  [titles.displayName]: displayName,
  [titles.ownerId]: id,
  [titles.createdAt]: formatTableDate(createdAt),
  [titles.deploymentId]: deploymentId,
});
