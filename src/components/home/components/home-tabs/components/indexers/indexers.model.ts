import { ColumnType } from "antd/es/table";
import { divide, subtract, map } from "ramda";
import {
  getEstimatedRewards,
  IndexersAllocation,
} from "../../../../../../model/indexers.model";
import { NetworkStats } from "../../../../../../model/network-stats.model";
import {
  createTitleWithTooltipDescription,
  renderFormattedValue,
  renderFormattedRealValue,
  renderFormattedValueWithPercentageTooltip,
  renderFormattedToPercentValueWithSeparatedValuesInTooltip,
  renderFormattedToPercentOfYearValue,
  renderFixedValue,
} from "../../../../../../utils/table.utils";
import {
  formatNumberToPercent,
  divideBy1e18,
  divideBy1e6,
} from "../../../../../../utils/number.utils";
import { calculateSubgraphProportion } from "../../../../../../utils/subgraph.utils";

export type TotalAllocationRaw = {
  id: string;
  indexingDelegatorRewards: string;
  closedAt: number;
};

export type TotalAllocation = TotalAllocationRaw & {
  totalDelegatedTokensAtClose: string | null;
};

export type DailyData = {
  dayNumber: number;
  dayStart: string;
  delegatedTokens: string;
};

export type TotalAllocationsResponse = {
  indexer: {
    id: string;
    totalAllocations: Array<TotalAllocationRaw>;
    dailyData: Array<DailyData>;
  };
};

export type IndexerRaw = {
  id: string;
  idOnL2: string | null;
  defaultDisplayName: string | null;
  stakedTokens: string;
  lockedTokens: string;
  delegatedTokens: string;
  allocatedTokens: string;
  queryFeeCut: number;
  indexingRewardCut: number;
  ownStakeRatio: string;
  allocations: Array<IndexersAllocation>;
  totalAllocations: Array<TotalAllocationRaw>;
  dailyData: Array<DailyData>;
};

export type Indexer = Omit<IndexerRaw, "totalAllocations" | "dailyData"> & {
  totalAllocations: Array<TotalAllocation>;
};

/**
 * Maps delegatedTokens from dailyData to totalAllocations.
 * For each allocation, finds the nearest dailyData entry where dayStart >= closedAt.
 */
export const mapDelegatedTokensToAllocations = (
  totalAllocations: Array<TotalAllocationRaw>,
  dailyData: Array<DailyData>,
): Array<TotalAllocation> => {
  // Sort dailyData by dayStart ascending for efficient search
  const sortedDailyData = [...dailyData].sort(
    (a, b) => Number(a.dayStart) - Number(b.dayStart),
  );

  return totalAllocations.map((allocation) => {
    const { closedAt } = allocation;

    // Find the first dailyData entry where dayStart >= closedAt (nearest in ascending order)
    const matchingDaily = sortedDailyData.find(
      (daily) => Number(daily.dayStart) >= closedAt,
    );

    return {
      ...allocation,
      totalDelegatedTokensAtClose: matchingDaily?.delegatedTokens ?? null,
    };
  });
};

export type IndexersRow = {
  id: string;
  key: string;
  name: string | null;
  indexingRewardCut: number;
  queryFeeCut: number;
  selfStaked: number;
  delegationPool: number;
  allocatedTokens: number;
  delegationRemaining: number;
  historicApy: number;
  estFuturePercentReward: number;
  allocationsEffectiveness: number;
  indexingRewardEffectiveCut: number | null;
  queryFeeEffectiveCut: number | null;
  allocationRate: number;
  favourite: boolean;
  allocations: Array<IndexersAllocation>;
  networkStats: Pick<
    NetworkStats,
    | "networkGRTIssuancePerBlock"
    | "totalTokensSignalled"
    | "deniedToTotalSignalledRatio"
  >;
};

export const PLANNED_PERIOD_DAYS = 60;

const titles: Record<
  Exclude<
    keyof IndexersRow,
    | "key"
    | "name"
    | "indexingRewardCut"
    | "queryFeeCut"
    | "allocationRate"
    | "favourite"
    | "networkStats"
    | "allocations"
  >,
  string
> = {
  id: "Indexer Address",
  indexingRewardEffectiveCut: "Effective reward cut",
  queryFeeEffectiveCut: "Effective Query fee cut",
  selfStaked: "Self Stake",
  delegationPool: "Delegation Pool",
  allocatedTokens: "Allocated",
  delegationRemaining: "Remain for Delegation",
  historicApy: "Historic APY 60d",
  estFuturePercentReward: "Current Est. APR",
  allocationsEffectiveness: "Effectiveness of allocations",
};

export const columnsWidth = {
  "2560": [48, 196, 202, 202, 202, 202, 202, 202, 203, 203, 203],
  "1920": [48, 172, 134, 134, 134, 134, 134, 134, 134, 134, 148],
  "1440": [48, 155, 117, 122, 117, 117, 118, 118, 118, 118, 132],
  "1280": [48, 136, 110, 110, 110, 110, 110, 110, 110, 110, 120],
};

export const createColumns = ({
  renderIndexerId,
  renderHistoricApy,
}: {
  renderIndexerId: (value: string, row: IndexersRow) => React.ReactElement;
  renderHistoricApy: (_: number, row: IndexersRow) => React.ReactElement;
}): Array<ColumnType<IndexersRow>> => [
  {
    title: createTitleWithTooltipDescription(
      titles.id,
      "The indexer’s Ethereum address or ENS.",
    ),
    dataIndex: "id",
    key: "id",
    fixed: "left",
    render: renderIndexerId,
    onCell: () => ({ className: "ant-table-cell_left-aligned" }),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.indexingRewardEffectiveCut,
      `
        Effective Reward Cut is a fee that Indexer charges Delegators for delegations management.
        <br><br>- If it's negative, it means that the Indexer is giving away part of their rewards
        <br><br>- If it's positive, the Indexer is keeping some of the rewards.
        <br><br>Rewards cut is a technical parameter that shows what % of indexer rewards given Indexer keeps 
        when sharing rewards with its delegators. It includes rewards for the Indexer's self-stacked GRTs.
      `,
    ),
    dataIndex: "indexingRewardEffectiveCut",
    key: "indexingRewardEffectiveCut",
    render: renderFormattedToPercentValueWithSeparatedValuesInTooltip(
      "Indexing Reward Cut",
      "indexingRewardCut",
    ),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.queryFeeEffectiveCut,
      "Effective Query fee cut  is a fee that Indexer charges Delegators for delegations management.",
    ),
    dataIndex: "queryFeeEffectiveCut",
    key: "queryFeeEffectiveCut",
    render: renderFormattedToPercentValueWithSeparatedValuesInTooltip(
      "Query Fee Cut",
      "queryFeeCut",
    ),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.selfStaked,
      `The Indexer's deposited stake, which may be slashed for malicious or incorrect behavior.`,
    ),
    dataIndex: "selfStaked",
    key: "selfStaked",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.delegationPool,
      "Stake from Delegators which can be allocated by the Indexer, but cannot be slashed.",
    ),
    dataIndex: "delegationPool",
    key: "delegationPool",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.allocatedTokens,
      "Stake that Indexers are actively allocating towards the subgraphs they are indexing.",
    ),
    dataIndex: "allocatedTokens",
    key: "allocatedTokens",
    render: renderFormattedValueWithPercentageTooltip("allocationRate"),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.delegationRemaining,
      "Amount of GRT that can be delegated to Indexer  without exceeding Indexer’s max capacity.",
    ),
    dataIndex: "delegationRemaining",
    key: "delegationRemaining",
    render: renderFormattedRealValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.historicApy,
      `
        Rewards rate of indexer based on period of the last 60 days and extrapolated to a year.
      `,
    ),
    dataIndex: "historicApy",
    key: "historicApy",
    render: renderHistoricApy,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.estFuturePercentReward,
      `
        This is the approximate Annual Percentage Rate (APR) that delegators currently receive, considering 
        the current ratio of self-stake to the delegate pool, and taking into account active allocations.
      `,
    ),
    dataIndex: "estFuturePercentReward",
    key: "estFuturePercentReward",
    render: renderFormattedToPercentOfYearValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.allocationsEffectiveness,
      `
        The average of the rewards proportions for all active allocations of the indexer.
      `,
    ),
    dataIndex: "allocationsEffectiveness",
    key: "allocationsEffectiveness",
    render: renderFixedValue(3),
  },
];

export const getHistoricApy = (
  totalAllocations: Array<TotalAllocation>,
  periodDays: number,
) =>
  divide(
    subtract(
      totalAllocations.reduce((acc, val) => {
        if (
          val.totalDelegatedTokensAtClose &&
          val.totalDelegatedTokensAtClose !== "0"
        ) {
          const wi = divide(
            Number(val.indexingDelegatorRewards),
            subtract(
              Number(val.totalDelegatedTokensAtClose),
              Number(val.indexingDelegatorRewards),
            ),
          );
          acc *= 1 + wi;
        }

        return acc;
      }, 1),
      1,
    ),
    periodDays,
  );

export const getHistoricApyPeriod = (plannedPeriod: number) => {
  return Math.floor(Date.now() / 1000) - plannedPeriod * 86400;
};

export const transformToRows =
  ({ favourites }: { favourites: Map<string, number> }) =>
  ({
    indexers,
    networkStats: {
      networkGRTIssuancePerBlock,
      totalTokensAllocated,
      totalTokensSignalled,
      deniedToTotalSignalledRatio,
    },
  }: {
    indexers: Array<Indexer>;
    networkStats: NetworkStats;
  }): Array<IndexersRow> => {
    const transformToRow = ({
      id,
      idOnL2,
      defaultDisplayName,
      stakedTokens: _stakedTokens,
      lockedTokens: _lockedTokens,
      delegatedTokens,
      allocatedTokens: _allocatedTokens,
      queryFeeCut: _queryFeeCut,
      indexingRewardCut: _indexingRewardCut,
      ownStakeRatio: _ownStakeRatio,
      allocations,
      totalAllocations,
    }: Indexer): IndexersRow => {
      const delegationPool = divideBy1e18(delegatedTokens);
      const indexingRewardCut = divideBy1e6(_indexingRewardCut);
      const queryFeeCut = divideBy1e6(_queryFeeCut);
      const ownStakeRatio = Number(_ownStakeRatio);
      const allocatedTokens = divideBy1e18(_allocatedTokens);
      const allocationRate = divide(
        Number(_allocatedTokens),
        Number(totalTokensAllocated),
      );
      const stakedTokens = divideBy1e18(_stakedTokens);
      const lockedTokens = divideBy1e18(_lockedTokens);
      const selfStaked = subtract(stakedTokens, lockedTokens);
      const delegationRemaining = selfStaked * 16 - delegationPool;
      const notAllocatedTokens =
        selfStaked +
        delegationPool +
        (delegationRemaining < 0 ? delegationRemaining : 0) -
        allocatedTokens;

      const { estFuturePercentReward } = getEstimatedRewards({
        delegationPool,
        delegationRemaining,
        indexingRewardCut,
        allocatedTokens: _allocatedTokens,
        plannedDelegation: "0",
        networkStats: {
          networkGRTIssuancePerBlock,
          totalTokensSignalled,
          deniedToTotalSignalledRatio,
        },
        allocations,
      });

      const numerator = allocations.reduce(
        (acc, { allocatedTokens, subgraphDeployment }) => {
          const { signalledTokens, stakedTokens } = subgraphDeployment;

          const proportion = calculateSubgraphProportion({
            subgraphSignals: signalledTokens,
            subgraphAllocations: stakedTokens,
            totalSignals: totalTokensSignalled,
            totalAllocations: totalTokensAllocated,
          });

          acc += divideBy1e18(allocatedTokens) * proportion;

          return acc;
        },
        0,
      );

      const denominator =
        allocatedTokens + (notAllocatedTokens > 0 ? notAllocatedTokens : 0);

      // Calculate effective cuts using ownStakeRatio from API
      // Formula: 1 - (1 - cut) / (1 - ownStakeRatio)
      const calculatedIndexingRewardEffectiveCut =
        ownStakeRatio < 1
          ? 1 - (1 - indexingRewardCut) / (1 - ownStakeRatio)
          : null;
      const calculatedQueryFeeEffectiveCut =
        ownStakeRatio < 1 ? 1 - (1 - queryFeeCut) / (1 - ownStakeRatio) : null;

      return {
        id,
        key: id,
        name: defaultDisplayName,
        indexingRewardCut,
        queryFeeCut,
        selfStaked,
        delegationPool,
        allocatedTokens,
        delegationRemaining,
        historicApy: getHistoricApy(totalAllocations, PLANNED_PERIOD_DAYS),
        estFuturePercentReward: delegationPool > 0 ? estFuturePercentReward : 0,
        allocationsEffectiveness: denominator > 0 ? numerator / denominator : 0,
        allocationRate,
        queryFeeEffectiveCut:
          delegationPool > 0 ? calculatedQueryFeeEffectiveCut : null,
        indexingRewardEffectiveCut:
          delegationPool > 0 ? calculatedIndexingRewardEffectiveCut : null,
        favourite: favourites.has(id),
        allocations,
        networkStats: {
          networkGRTIssuancePerBlock,
          totalTokensSignalled,
          deniedToTotalSignalledRatio,
        },
      };
    };

    return map(transformToRow, indexers);
  };

export const transformToCsvRow = ({
  id,
  name,
  indexingRewardCut,
  queryFeeCut,
  selfStaked,
  delegationPool,
  allocatedTokens,
  delegationRemaining,
  historicApy,
  estFuturePercentReward,
  allocationsEffectiveness,
  allocationRate,
  queryFeeEffectiveCut,
  indexingRewardEffectiveCut,
}: IndexersRow) => ({
  [titles.id]: name ?? id,
  [titles.indexingRewardEffectiveCut]:
    typeof indexingRewardEffectiveCut === "number"
      ? `${formatNumberToPercent(indexingRewardEffectiveCut)} | ${formatNumberToPercent(indexingRewardCut)}`
      : null,
  [titles.queryFeeEffectiveCut]:
    typeof queryFeeEffectiveCut === "number"
      ? `${formatNumberToPercent(queryFeeEffectiveCut)} | ${formatNumberToPercent(queryFeeCut)}`
      : null,
  [titles.selfStaked]: selfStaked,
  [titles.delegationPool]: delegationPool,
  [titles.allocatedTokens]: `${allocatedTokens} (${formatNumberToPercent(allocationRate)})`,
  [titles.delegationRemaining]: delegationRemaining,
  [titles.historicApy]: historicApy,
  [titles.estFuturePercentReward]: `${formatNumberToPercent(estFuturePercentReward * 365)}`,
  [titles.allocationsEffectiveness]: allocationsEffectiveness,
});
