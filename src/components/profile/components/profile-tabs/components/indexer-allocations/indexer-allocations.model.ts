import { isNil } from "ramda";
import { ColumnType } from "antd/es/table";
import {
  AllocationsRewards,
  IndexerDailyData,
  PotentialRewards,
  findDailyDataAtClose,
} from "../../../../../../model/allocation-rewards.model";
import { SubgraphStates } from "../../../../../../model/subgraph-states.model";
import { dhm } from "../../../../../../utils/date.utils";
import {
  formatNumberToPercent,
  divideBy1e18,
  divideBy1e6,
} from "../../../../../../utils/number.utils";
import {
  calculateSubgraphProportion,
  isNewSubgraph,
} from "../../../../../../utils/subgraph.utils";
import {
  allocationStatus,
  poi,
  createTitleWithTooltipDescription,
  renderImage,
  renderFormattedValue,
  renderFormattedValuePotential,
  renderSubgraphName,
  renderDeploymentId,
  renderLifetimeValue,
  renderFormattedToPercentValueWithSeparatedValuesInTooltip,
  renderHashId,
  renderDate,
  formatTableDate,
  renderFixedValue,
} from "../../../../../../utils/table.utils";

export type IndexerAllocation = {
  id: string;
  status: "Active" | "Closed" | "Finalized" | "Claimed";
  allocatedTokens: string;
  createdAt: number;
  createdAtEpoch: number;
  closedAt: number | null;
  closedAtEpoch: number | null;
  indexingRewardCutAtClose: number | null;
  indexingRewardEffectiveCutAtClose: string | null;
  indexingIndexerRewards: string;
  indexingDelegatorRewards: string;
  queryFeesCollected: string;
  queryFeeRebates: string;
  poi: string | null;
  isLegacy: boolean;
  provision: {
    dataService: {
      id: string;
    };
  } | null;
  indexer: {
    id: string;
    indexingRewardCut: number;
    ownStakeRatio: string;
    delegatedTokens: string;
  };
  subgraphDeployment: {
    id: string;
    stakedTokens: string;
    signalledTokens: string;
    manifest: {
      network: string | null;
    } | null;
    versions: Array<{
      id: string;
      subgraph: {
        id: string;
        active: boolean;
        createdAt: number;
        metadata: {
          image: string | null;
          displayName: string | null;
        } | null;
        currentVersion: {
          id: string;
          subgraphDeployment: {
            id: string;
            deniedAt: number;
            versions: Array<{
              id: string;
              subgraph: {
                id: string;
                currentVersion: {
                  id: string;
                } | null;
              };
              subgraphDeployment: {
                id: string;
              };
            }>;
          };
        } | null;
      };
      subgraphDeployment: {
        id: string;
        stakedTokens: string;
        signalledTokens: string;
      };
    }>;
  };
};

export type IndexerAllocationsRow = SubgraphStates & {
  id: string;
  key: string;
  image: string | null;
  subgraphName: string | null;
  network: string | null;
  subgraphProportion: number;
  statusInt: "Active" | "Closed" | "Finalized" | "Claimed";
  allocatedTokens: number;
  createdAt: number;
  closedAt: number | null;
  activeStateDuration: string;
  indexingRewardCutAtClose: number | null;
  indexingRewardEffectiveCutAtClose: number | null;
  indexingIndexerRewards: number | null;
  indexingDelegatorRewards: number | null;
  queryFeesCollected: number;
  queryFeeRebates: number;
  poi: string | null;
  subgraphId: string;
  subgraphDeploymentId: string;
  versionId: string;
  potentialIndexingRewardCut: number;
  lifetimeEpochs: number;
  rewardsIssuer: string;
};

const titles: Record<
  Exclude<
    keyof IndexerAllocationsRow,
    | "key"
    | "subgraphId"
    | "versionId"
    | "indexingRewardCutAtClose"
    | "potentialIndexingRewardCut"
    | "lifetimeEpochs"
    | "rewardsIssuer"
    | keyof SubgraphStates
  >,
  string
> = {
  image: "Img",
  subgraphName: "Subgraph",
  network: "Network",
  subgraphProportion: "Rewards Proportion",
  subgraphDeploymentId: "Deployment ID",
  statusInt: "Status",
  allocatedTokens: "Allocated",
  createdAt: "Created",
  closedAt: "Closed",
  activeStateDuration: "Active State Duration",
  indexingRewardEffectiveCutAtClose: "Rewards Cut",
  indexingIndexerRewards: "Indexer Rewards",
  indexingDelegatorRewards: " Delegators Rewards",
  queryFeesCollected: "Query Fees Collected",
  queryFeeRebates: "Query Fees Rebates",
  id: "Allocation ID",
  poi: "POI",
};

export const columnsWidth = {
  "2560": [
    60, 215, 230, 126, 215, 126, 126, 225, 225, 155, 126, 126, 126, 126, 126,
    190, 190,
  ],
  "1920": [
    55, 190, 192, 120, 190, 100, 100, 202, 202, 140, 112, 112, 112, 115, 115,
    172, 172,
  ],
  "1440": [
    55, 168, 168, 110, 168, 95, 95, 180, 180, 125, 100, 100, 100, 105, 105, 150,
    150,
  ],
  "1280": [
    55, 153, 150, 95, 153, 90, 90, 155, 155, 110, 90, 90, 90, 90, 90, 130, 130,
  ],
};

export const createColumns = (
  renderRewardsButton: (
    allocationId: string,
    potentialIndexingRewardCut: number,
    rewardsIssuer: string,
  ) => void,
): Array<ColumnType<IndexerAllocationsRow>> => [
  {
    title: createTitleWithTooltipDescription(titles.image),
    dataIndex: "image",
    key: "image",
    render: renderImage,
  },
  {
    title: createTitleWithTooltipDescription(titles.subgraphName),
    dataIndex: "subgraphName",
    key: "subgraphName",
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
    title: createTitleWithTooltipDescription(
      titles.subgraphProportion,
      `
        Division of the ratio of subgraph signals to the total value of signals by the ratio of
        subgraph allocations to the total value of allocations.
      `,
    ),
    dataIndex: "subgraphProportion",
    key: "subgraphProportion",
    render: renderFixedValue(4),
  },
  {
    title: createTitleWithTooltipDescription(titles.subgraphDeploymentId),
    dataIndex: "subgraphDeploymentId",
    key: "subgraphDeploymentId",
    onCell: () => ({ className: "ant-table-cell_with-link" }),
    render: renderDeploymentId(),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.statusInt,
      allocationStatus.description,
    ),
    dataIndex: "statusInt",
    key: "statusInt",
    align: "center",
    render: allocationStatus.render,
  },
  {
    title: createTitleWithTooltipDescription(titles.allocatedTokens),
    dataIndex: "allocatedTokens",
    key: "allocatedTokens",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(titles.createdAt),
    dataIndex: "createdAt",
    key: "createdAt",
    align: "center",
    render: renderDate,
  },
  {
    title: createTitleWithTooltipDescription(titles.closedAt),
    dataIndex: "closedAt",
    key: "closedAt",
    align: "center",
    render: renderDate,
  },
  {
    title: createTitleWithTooltipDescription(titles.activeStateDuration),
    dataIndex: "activeStateDuration",
    key: "activeStateDuration",
    render: renderLifetimeValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.indexingRewardEffectiveCutAtClose,
    ),
    dataIndex: "indexingRewardEffectiveCutAtClose",
    key: "indexingRewardEffectiveCutAtClose",
    render: (value, row) =>
      typeof value === "number"
        ? renderFormattedToPercentValueWithSeparatedValuesInTooltip(
            "Indexing Reward Cut",
            "indexingRewardCutAtClose",
          )(value, row)
        : value,
  },
  {
    title: createTitleWithTooltipDescription(titles.indexingIndexerRewards),
    dataIndex: "indexingIndexerRewards",
    key: "indexingIndexerRewards",
    render: (value, row) =>
      row.statusInt === "Active"
        ? !isNil(value)
          ? renderFormattedValuePotential(value)
          : renderRewardsButton(
              row.id,
              row.potentialIndexingRewardCut,
              row.rewardsIssuer,
            )
        : renderFormattedValue(value),
  },
  {
    title: createTitleWithTooltipDescription(titles.indexingDelegatorRewards),
    dataIndex: "indexingDelegatorRewards",
    key: "indexingDelegatorRewards",
    render: (value, row) =>
      row.statusInt === "Active"
        ? !isNil(value)
          ? renderFormattedValuePotential(value)
          : null
        : renderFormattedValue(value),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.queryFeesCollected,
      `
        Query fees are collected by the gateway whenever an allocation is closed and accumulated in the 
        subgraph's query fee rebate pool.
      `,
    ),
    dataIndex: "queryFeesCollected",
    key: "queryFeesCollected",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.queryFeeRebates,
      `
        Payments for serving queries on the network. These payments are mediated via state channels 
        between an indexer and a gateway. Each query request from a gateway contains a payment and the 
        corresponding response a proof of query result validity.
      `,
    ),
    dataIndex: "queryFeeRebates",
    key: "queryFeeRebates",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(titles.id),
    dataIndex: "id",
    key: "id",
    align: "center",
    render: renderHashId,
  },
  {
    title: createTitleWithTooltipDescription(titles.poi, poi.description),
    dataIndex: "poi",
    key: "poi",
    render: poi.render,
    align: "center",
  },
];

export const createTransformerToRows =
  (
    allocationsRewards: AllocationsRewards = {},
    indexerDailyData: Array<IndexerDailyData> = [],
  ) =>
  ({
    allocations,
    currentEpoch = 0,
    totalTokensAllocated,
    totalTokensSignalled,
  }: {
    allocations: Array<IndexerAllocation>;
    currentEpoch?: number;
    totalTokensAllocated: string;
    totalTokensSignalled: string;
  }) => {
    // Legacy allocations use the old subgraph service address
    const LEGACY_DATA_SERVICE_ADDRESS =
      "0x00669A4CF01450B64E8A2A20E9b1FCB71E61eF03";

    const transformToRow = ({
      id,
      status,
      allocatedTokens,
      createdAt,
      createdAtEpoch,
      closedAt,
      closedAtEpoch,
      indexingRewardCutAtClose,
      indexingRewardEffectiveCutAtClose,
      indexingIndexerRewards,
      indexingDelegatorRewards,
      queryFeesCollected,
      queryFeeRebates,
      poi,
      isLegacy,
      provision,
      indexer,
      subgraphDeployment: {
        id: deploymentId,
        stakedTokens,
        signalledTokens,
        versions,
        manifest,
      },
    }: IndexerAllocation): IndexerAllocationsRow => {
      // Determine rewardsIssuer based on isLegacy flag
      const rewardsIssuer = isLegacy
        ? LEGACY_DATA_SERVICE_ADDRESS
        : (provision?.dataService?.id ?? LEGACY_DATA_SERVICE_ADDRESS);
      const [earliestActualVersion] = versions
        .filter(
          (v) =>
            v.subgraph.currentVersion?.subgraphDeployment.id === deploymentId,
        )
        .sort((a, b) => a.subgraph.createdAt - b.subgraph.createdAt);

      const [lastPastVersion] = earliestActualVersion
        ? []
        : [...versions].sort(
            (a, b) => b.subgraph.createdAt - a.subgraph.createdAt,
          );

      const rewards: PotentialRewards | undefined = allocationsRewards[id];

      const denied = earliestActualVersion?.subgraph.currentVersion
        ? earliestActualVersion.subgraph.currentVersion.subgraphDeployment
            .deniedAt > 0
        : false;

      const version = earliestActualVersion ?? lastPastVersion;

      return {
        id,
        key: id,
        image:
          earliestActualVersion?.subgraph.metadata?.image ??
          lastPastVersion?.subgraph.metadata?.image ??
          null,
        subgraphName:
          earliestActualVersion?.subgraph.metadata?.displayName ??
          lastPastVersion?.subgraph.metadata?.displayName ??
          null,
        network: manifest?.network ?? null,
        subgraphProportion: Number(stakedTokens)
          ? calculateSubgraphProportion({
              subgraphSignals: signalledTokens,
              subgraphAllocations: stakedTokens,
              totalAllocations: totalTokensAllocated,
              totalSignals: totalTokensSignalled,
            })
          : 0,
        subgraphDeploymentId: deploymentId,
        statusInt: status,
        allocatedTokens: divideBy1e18(allocatedTokens),
        createdAt,
        closedAt,
        activeStateDuration: dhm(
          (closedAt ? closedAt * 1000 : Date.now()) - createdAt * 1000,
        ),
        indexingRewardEffectiveCutAtClose: (() => {
          // Formula: 1 - (1 - cut) / (1 - ownStakeRatio)
          if (status === "Active" && rewards) {
            // Active: use current indexer data
            const ownStakeRatio = Number(indexer.ownStakeRatio);
            const hasDelegations = Number(indexer.delegatedTokens) > 0;
            const cut = divideBy1e6(indexer.indexingRewardCut);
            return hasDelegations && ownStakeRatio < 1
              ? 1 - (1 - cut) / (1 - ownStakeRatio)
              : null;
          }

          // For Closed/Finalized/Claimed: use historical dailyData at close time
          if (
            typeof indexingRewardCutAtClose === "number" &&
            closedAt !== null
          ) {
            const dailyDataAtClose = findDailyDataAtClose(
              indexerDailyData,
              closedAt,
            );
            if (dailyDataAtClose) {
              const cut = divideBy1e6(indexingRewardCutAtClose);
              const ownStakeRatio = Number(dailyDataAtClose.ownStakeRatio);
              const hasDelegations =
                Number(dailyDataAtClose.delegatedTokens) > 0;
              return hasDelegations && ownStakeRatio < 1
                ? 1 - (1 - cut) / (1 - ownStakeRatio)
                : null;
            }
          }

          return null;
        })(),
        indexingRewardCutAtClose:
          status === "Active" && rewards
            ? divideBy1e6(indexer.indexingRewardCut)
            : typeof indexingRewardCutAtClose === "number"
              ? divideBy1e6(indexingRewardCutAtClose)
              : null,
        indexingIndexerRewards:
          status === "Active"
            ? rewards?.potentialIndexerRewards
            : divideBy1e18(indexingIndexerRewards),
        indexingDelegatorRewards:
          status === "Active"
            ? rewards?.potentialDelegatorRewards
            : divideBy1e18(indexingDelegatorRewards),
        potentialIndexingRewardCut: divideBy1e6(indexer.indexingRewardCut),
        queryFeesCollected: divideBy1e18(queryFeesCollected),
        queryFeeRebates: divideBy1e18(queryFeeRebates),
        poi,
        subgraphId: version?.subgraph.id,
        versionId: version?.id,
        deprecated:
          !earliestActualVersion || !earliestActualVersion.subgraph.active,
        denied,
        hasLinkedSubgraphs:
          !denied &&
          earliestActualVersion?.subgraph.currentVersion &&
          earliestActualVersion.subgraph.active
            ? earliestActualVersion.subgraph.currentVersion.subgraphDeployment.versions.some(
                (x) =>
                  x.subgraph.currentVersion &&
                  x.subgraph.id !== earliestActualVersion.subgraph.id &&
                  x.subgraphDeployment.id ===
                    earliestActualVersion.subgraph.currentVersion
                      ?.subgraphDeployment.id,
              )
            : false,
        isNew: isNewSubgraph(earliestActualVersion?.subgraph.createdAt ?? 0),
        lifetimeEpochs: (closedAtEpoch ?? currentEpoch) - createdAtEpoch,
        rewardsIssuer,
      };
    };

    return allocations.map(transformToRow);
  };

export const transformToCsvRow = ({
  id,
  image,
  subgraphName,
  subgraphProportion,
  subgraphDeploymentId,
  statusInt,
  allocatedTokens,
  createdAt,
  closedAt,
  activeStateDuration,
  indexingRewardCutAtClose,
  indexingRewardEffectiveCutAtClose,
  indexingIndexerRewards,
  indexingDelegatorRewards,
  queryFeesCollected,
  queryFeeRebates,
  poi,
  network,
}: IndexerAllocationsRow) => ({
  [titles.image]: image,
  [titles.subgraphName]: subgraphName,
  [titles.network]: network,
  [titles.subgraphProportion]: subgraphProportion,
  [titles.subgraphDeploymentId]: subgraphDeploymentId,
  [titles.statusInt]: statusInt,
  [titles.allocatedTokens]: allocatedTokens,
  [titles.createdAt]: formatTableDate(createdAt),
  [titles.closedAt]: closedAt ? formatTableDate(closedAt) : null,
  [titles.activeStateDuration]: activeStateDuration,
  [titles.indexingRewardEffectiveCutAtClose]:
    indexingRewardEffectiveCutAtClose && indexingRewardCutAtClose
      ? `${formatNumberToPercent(indexingRewardEffectiveCutAtClose)} | ${formatNumberToPercent(
          indexingRewardCutAtClose,
        )}`
      : null,
  [titles.indexingIndexerRewards]: indexingIndexerRewards,
  [titles.indexingDelegatorRewards]: indexingDelegatorRewards,
  [titles.queryFeesCollected]: queryFeesCollected,
  [titles.queryFeeRebates]: queryFeeRebates,
  [titles.id]: id,
  [titles.poi]: poi,
});
