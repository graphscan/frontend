import { isNil } from "ramda";
import { ColumnType } from "antd/es/table";
import {
  allocationStatus,
  poi,
  renderAccountId,
  createTitleWithTooltipDescription,
  renderFormattedValue,
  renderLifetimeValue,
  renderFormattedToPercentValueWithSeparatedValuesInTooltip,
  renderFormattedValuePotential,
  renderDate,
  renderHashId,
  formatTableDate,
} from "../../../../../../../../utils/table.utils";
import {
  AllocationsRewards,
  IndexerDailyData,
  PotentialRewards,
  findDailyDataAtClose,
} from "../../../../../../../../model/allocation-rewards.model";
import { dhm } from "../../../../../../../../utils/date.utils";
import {
  divideBy1e18,
  divideBy1e6,
} from "../../../../../../../../utils/number.utils";

export type SubgraphAllocation = {
  id: string;
  indexer: {
    id: string;
    defaultDisplayName: string | null;
    indexingRewardCut: number;
    ownStakeRatio: string;
    delegatedTokens: string;
  };
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
  poi: string | null;
};

export type SubgraphAllocationsRow = {
  id: string;
  indexer: string;
  name: string | null;
  key: string;
  statusInt: "Active" | "Closed" | "Finalized" | "Claimed";
  allocatedTokens: number;
  createdAt: number;
  closedAt: number | null;
  activeStateDuration: string;
  indexingRewardCutAtClose: number | null;
  indexingRewardEffectiveCutAtClose: number | null;
  indexingIndexerRewards: number | null;
  indexingDelegatorRewards: number | null;
  poi: string | null;
  potentialIndexingRewardCut: number;
  lifetimeEpochs: number;
};

const titles: Record<
  Exclude<
    keyof SubgraphAllocationsRow,
    | "key"
    | "name"
    | "indexingRewardCutAtClose"
    | "potentialIndexingRewardCut"
    | "lifetimeEpochs"
  >,
  string
> = {
  id: "Allocation ID",
  indexer: "Indexer ID",
  statusInt: "Status",
  allocatedTokens: "Allocated",
  createdAt: "Created",
  closedAt: "Closed",
  activeStateDuration: "Active State Duration",
  indexingRewardEffectiveCutAtClose: "Effective Reward Cut",
  indexingIndexerRewards: "Indexer Rewards",
  indexingDelegatorRewards: " Delegators Rewards",
  poi: "POI",
};

export const columnsWidth = {
  "2560": [187, 174, 174, 225, 225, 174, 174, 174, 174, 192, 192],
  "1920": [172, 100, 120, 202, 202, 140, 120, 120, 120, 172, 172],
  "1440": [150, 95, 110, 180, 180, 125, 110, 110, 110, 150, 150],
  "1280": [132, 90, 100, 155, 155, 110, 100, 100, 100, 130, 130],
};

export const createColumns = (
  renderRewardsButton: (
    allocationId: string,
    potentialIndexingRewardCut: number,
  ) => void,
): Array<ColumnType<SubgraphAllocationsRow>> => [
  {
    title: createTitleWithTooltipDescription(titles.indexer),
    dataIndex: "indexer",
    key: "indexer",
    render: renderAccountId("indexer-details"),
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
          : renderRewardsButton(row.id, row.potentialIndexingRewardCut)
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

export const createTransformerToRow =
  (
    {
      allocationsRewards,
      currentEpoch,
      dailyDataByIndexer,
    }: {
      allocationsRewards?: AllocationsRewards;
      currentEpoch?: number;
      dailyDataByIndexer?: Record<string, Array<IndexerDailyData>>;
    } = {},
  ) =>
  ({
    id,
    indexer,
    status,
    allocatedTokens,
    createdAt,
    closedAtEpoch,
    closedAt,
    createdAtEpoch,
    indexingRewardCutAtClose,
    indexingRewardEffectiveCutAtClose,
    indexingIndexerRewards,
    indexingDelegatorRewards,
    poi,
  }: SubgraphAllocation): SubgraphAllocationsRow => {
    const rewards: PotentialRewards | undefined =
      (allocationsRewards ?? {})[id];

    return {
      id,
      indexer: indexer.id,
      name: indexer.defaultDisplayName,
      key: id,
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
          // Active: calculate from current indexer data
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
          const indexerDailyData =
            (dailyDataByIndexer ?? {})[indexer.id] ?? [];
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
      poi,
      lifetimeEpochs: (closedAtEpoch ?? (currentEpoch ?? 0)) - createdAtEpoch,
    };
  };

export const transformToCsvRow = ({
  indexer,
  name,
  statusInt,
  allocatedTokens,
  createdAt,
  closedAt,
  activeStateDuration,
  indexingRewardEffectiveCutAtClose,
  poi,
}: SubgraphAllocationsRow) => ({
  [titles.indexer]: name ?? indexer,
  [titles.statusInt]: statusInt,
  [titles.allocatedTokens]: allocatedTokens,
  [titles.createdAt]: formatTableDate(createdAt),
  [titles.closedAt]: closedAt ? formatTableDate(closedAt) : null,
  [titles.activeStateDuration]: activeStateDuration,
  [titles.indexingRewardEffectiveCutAtClose]: indexingRewardEffectiveCutAtClose,
  [titles.poi]: poi,
});
