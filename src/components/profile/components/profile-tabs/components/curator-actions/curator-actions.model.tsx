import { ColumnType } from "antd/es/table";
import { SubgraphStates } from "../../../../../../model/subgraph-states.model";
import { divideBy1e18 } from "../../../../../../utils/number.utils";
import {
  createTitleWithTooltipDescription,
  renderDeploymentId,
  renderSubgraphName,
  renderFormattedValue,
  renderDate,
  formatTableDate,
} from "../../../../../../utils/table.utils";

export type NameSignalTransaction = {
  id: string;
  timestamp: number;
  type: string;
  nameSignal: string;
  tokens: string;
  subgraph: {
    id: string;
    metadata: {
      image: string | null;
      displayName: string | null;
    } | null;
    currentVersion: {
      id: string;
      subgraphDeployment: {
        id: string;
      };
    } | null;
  } | null;
};

export type SignalTransaction = {
  id: string;
  timestamp: number;
  type: string;
  signal: string;
  tokens: string;
  subgraphDeployment: {
    id: string;
    versions: Array<{
      subgraph: {
        id: string;
        metadata: {
          image: string | null;
          displayName: string | null;
        } | null;
        currentVersion: {
          id: string;
        } | null;
      };
    }>;
  };
};

export type CuratorActionsRow = SubgraphStates & {
  id: string;
  key: string;
  timestamp: number;
  action: "Mint" | "Burn";
  signalType: "Auto-Migrate" | "Deployment Signal";
  txLink: string;
  img: string;
  displayName: string;
  deploymentId: string | null;
  tokens: number;
  shares: number;
  versionId: string;
  subgraphId: string;
};

const titles: Record<
  Exclude<
    keyof CuratorActionsRow,
    | "id"
    | "key"
    | "versionId"
    | "subgraphId"
    | "txLink"
    | "img"
    | keyof SubgraphStates
  >,
  string
> = {
  timestamp: "Time",
  action: "Action",
  signalType: "Signal Type",
  displayName: "Subgraph Name",
  deploymentId: "Deployment ID",
  tokens: "Tokens Value",
  shares: "Shares Value",
};

// Parse transaction ID to get tx hash and log index
// Format: "0x...txhash-logIndex"
const parseTxId = (id: string): { txHash: string; logIndex: string } => {
  const lastDashIndex = id.lastIndexOf("-");
  if (lastDashIndex === -1) {
    return { txHash: id, logIndex: "0" };
  }
  return {
    txHash: id.substring(0, lastDashIndex),
    logIndex: id.substring(lastDashIndex + 1),
  };
};

const renderAction = (action: "Mint" | "Burn", row: CuratorActionsRow) => {
  const isMint = action === "Mint";
  const emoji = isMint ? "✨" : "🔥";
  const color = isMint ? "#4cd08e" : "#f4466d";

  return (
    <a
      href={row.txLink}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color, textDecoration: "none", fontWeight: 600 }}
    >
      {emoji} {action}
    </a>
  );
};

const renderSignalType = (signalType: "Auto-Migrate" | "Deployment Signal") => {
  return <span>{signalType}</span>;
};

export const columnsWidth = {
  "2560": [180, 100, 180, 240, 250, 140, 140],
  "1920": [160, 85, 160, 210, 220, 120, 120],
  "1440": [145, 75, 145, 185, 195, 105, 105],
  "1280": [130, 65, 130, 165, 175, 95, 95],
};

export const columns: Array<ColumnType<CuratorActionsRow>> = [
  {
    title: createTitleWithTooltipDescription(titles.timestamp),
    dataIndex: "timestamp",
    key: "timestamp",
    align: "center",
    render: renderDate,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.action,
      "Type of curator action. Click to view transaction.",
    ),
    dataIndex: "action",
    key: "action",
    align: "center",
    render: renderAction,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.signalType,
      "Auto-Migrate for subgraph signals, Deployment Signal for deployment signals.",
    ),
    dataIndex: "signalType",
    key: "signalType",
    align: "center",
    render: renderSignalType,
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
    title: createTitleWithTooltipDescription(titles.deploymentId),
    dataIndex: "deploymentId",
    key: "deploymentId",
    align: "center",
    onCell: () => ({ className: "ant-table-cell_with-link" }),
    render: renderDeploymentId(),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.tokens,
      "Amount of GRT tokens involved in the action.",
    ),
    dataIndex: "tokens",
    key: "tokens",
    align: "center",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.shares,
      "Amount of signal shares involved in the action.",
    ),
    dataIndex: "shares",
    key: "shares",
    align: "center",
    render: renderFormattedValue,
  },
];

const getActionFromType = (type: string): "Mint" | "Burn" => {
  if (type.includes("Mint")) return "Mint";
  return "Burn";
};

export const transformNameSignalToRow = (
  transaction: NameSignalTransaction,
): CuratorActionsRow => {
  const { id, timestamp, type, nameSignal, tokens, subgraph } = transaction;
  const { txHash, logIndex } = parseTxId(id);

  return {
    id,
    key: id,
    timestamp,
    action: getActionFromType(type),
    signalType: "Auto-Migrate",
    txLink: `https://arbiscan.io/tx/${txHash}#eventlog#${logIndex}`,
    img: subgraph?.metadata?.image ?? "",
    displayName: subgraph?.metadata?.displayName ?? subgraph?.id ?? "Unknown",
    deploymentId: subgraph?.currentVersion?.subgraphDeployment?.id ?? null,
    tokens: divideBy1e18(tokens),
    shares: divideBy1e18(nameSignal),
    versionId: subgraph?.currentVersion?.id ?? "",
    subgraphId: subgraph?.id ?? "",
    denied: false,
    deprecated: !subgraph?.currentVersion,
    hasLinkedSubgraphs: false,
    isNew: false,
  };
};

export const transformSignalToRow = (
  transaction: SignalTransaction,
): CuratorActionsRow => {
  const { id, timestamp, type, signal, tokens, subgraphDeployment } =
    transaction;
  const { txHash, logIndex } = parseTxId(id);

  const latestVersion = subgraphDeployment.versions[0];
  const subgraph = latestVersion?.subgraph;

  return {
    id,
    key: id,
    timestamp,
    action: getActionFromType(type),
    signalType: "Deployment Signal",
    txLink: `https://arbiscan.io/tx/${txHash}#eventlog#${logIndex}`,
    img: subgraph?.metadata?.image ?? "",
    displayName: subgraph?.metadata?.displayName ?? subgraphDeployment.id,
    deploymentId: subgraphDeployment.id,
    tokens: divideBy1e18(tokens),
    shares: divideBy1e18(signal),
    versionId: subgraph?.currentVersion?.id ?? "",
    subgraphId: subgraph?.id ?? "",
    denied: false,
    deprecated: !subgraph?.currentVersion,
    hasLinkedSubgraphs: false,
    isNew: false,
  };
};

export const transformToCsvRow = ({
  timestamp,
  action,
  signalType,
  txLink,
  displayName,
  deploymentId,
  tokens,
  shares,
}: CuratorActionsRow) => ({
  [titles.timestamp]: timestamp ? formatTableDate(timestamp) : null,
  [titles.action]: action,
  [titles.signalType]: signalType,
  "Transaction Link": txLink,
  [titles.displayName]: displayName,
  [titles.deploymentId]: deploymentId,
  [titles.tokens]: tokens,
  [titles.shares]: shares,
});
