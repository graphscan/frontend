import { ColumnType } from "antd/es/table";
import { divide, subtract, map } from "ramda";
import {
  getEstimatedRewards,
  IndexersAllocation,
} from "../../../../../../model/indexers.model";
import { NetworkStats } from "../../../../../../model/network-stats.model";
import { RewardParameters } from "../../../../../../services/reward-parameters.service";
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
import {
  getIndexerCapacity,
  IndexerProvision,
} from "../../../../../../utils/indexer-capacity.utils";

import { HistoricApy } from "../../../../../../utils/historic-apy.utils";

export type IndexerRaw = {
  id: string;
  idOnL2: string | null;
  defaultDisplayName: string | null;
  stakedTokens: string;
  lockedTokens: string;
  delegatedTokens: string;
  delegatedThawingTokens: string;
  allocatedTokens: string;
  provisions: IndexerProvision[];
  queryFeeCut: number;
  indexingRewardCut: number;
  legacyIndexingRewardCut: number;
  ownStakeRatio: string;
  allocations: Array<IndexersAllocation>;
};

export type Indexer = IndexerRaw & {
  historicApy: HistoricApy | null;
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
  delegationRemaining: number | null;
  historicApy: number | null;
  historicApyHistory: HistoricApy | null;
  estFuturePercentReward: number | null;
  allocationsEffectiveness: number | null;
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
    | "historicApyHistory"
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
  renderHistoricApy: (_: number | null, row: IndexersRow) => React.ReactElement;
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
      "Total delegated tokens, including tokens thawing for withdrawal. The indexer profile shows the active and thawing portions separately. Excludes the indexer's own stake.",
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
      "Combined delegation headroom across services, based on active provisioned self stake and each service's ratio. Excludes thawing funds. Service limits apply independently; a dash means parameters are unavailable.",
    ),
    dataIndex: "delegationRemaining",
    key: "delegationRemaining",
    render: (value: number | null) =>
      value === null ? "—" : renderFormattedRealValue(value),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.historicApy,
      `
        Annual compounded return of an active delegation share over the last 60 completed UTC days.
        Includes reinvested indexing rewards (including collect on open allocations) and query fees.
        Thawing tokens are excluded. This is historical performance, not a forecast.
        A dash means comparable pool history is unavailable.
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
        Estimated annual indexing rewards per active delegated GRT, using the current issuance rate,
        active allocations and each pool's reward cut. Tokens thawing for withdrawal are excluded.
        This is an average across the indexer's delegation pools; individual pools can earn different rates.
        It assumes successful reward claims; eligibility and proof-of-indexing conditions can reduce actual rewards.
        A dash means current on-chain reward parameters are unavailable.
      `,
    ),
    dataIndex: "estFuturePercentReward",
    key: "estFuturePercentReward",
    render: (value: number | null) =>
      value === null ? "—" : renderFormattedToPercentOfYearValue(value),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.allocationsEffectiveness,
      `
        The average of the rewards proportions for all active allocations of the indexer,
        including available allocation capacity. Thawing funds are excluded.
        A dash means service capacity parameters are unavailable.
      `,
    ),
    dataIndex: "allocationsEffectiveness",
    key: "allocationsEffectiveness",
    render: (value: number | null) =>
      value === null ? "—" : renderFixedValue(3)(value),
  },
];

export const transformToRows =
  ({ favourites }: { favourites: Map<string, number> }) =>
  ({
    indexers,
    rewardParameters,
    networkStats: {
      networkGRTIssuancePerBlock,
      totalTokensAllocated,
      totalTokensSignalled,
      deniedToTotalSignalledRatio,
    },
  }: {
    indexers: Array<Indexer>;
    networkStats: NetworkStats;
    rewardParameters: RewardParameters | null;
  }): Array<IndexersRow> => {
    const transformToRow = ({
      id,
      idOnL2,
      defaultDisplayName,
      stakedTokens: _stakedTokens,
      lockedTokens: _lockedTokens,
      delegatedTokens,
      delegatedThawingTokens,
      allocatedTokens: _allocatedTokens,
      queryFeeCut: _queryFeeCut,
      indexingRewardCut: _indexingRewardCut,
      legacyIndexingRewardCut,
      ownStakeRatio: _ownStakeRatio,
      allocations,
      provisions,
      historicApy,
    }: Indexer): IndexersRow => {
      const delegationPool = divideBy1e18(delegatedTokens);
      const activeDelegationPool = Math.max(
        0,
        delegationPool - divideBy1e18(delegatedThawingTokens),
      );
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
      const { delegationRemaining, availableToAllocate } =
        getIndexerCapacity(provisions);

      const estFuturePercentReward = rewardParameters
        ? getEstimatedRewards({
            delegationPool: activeDelegationPool,
            delegationRemaining: delegationRemaining ?? 0,
            indexingRewardCut: divideBy1e6(legacyIndexingRewardCut),
            allocatedTokens: _allocatedTokens,
            plannedDelegation: "0",
            networkStats: rewardParameters,
            allocations,
          }).estFuturePercentReward
        : null;

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
        availableToAllocate === null
          ? null
          : allocatedTokens + availableToAllocate;

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
        historicApy: historicApy?.periods[60] ?? null,
        historicApyHistory: historicApy ?? null,
        estFuturePercentReward,
        allocationsEffectiveness:
          denominator === null
            ? null
            : denominator > 0
              ? numerator / denominator
              : 0,
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
  [titles.historicApy]:
    historicApy === null ? null : formatNumberToPercent(historicApy),
  [titles.estFuturePercentReward]:
    estFuturePercentReward === null
      ? null
      : formatNumberToPercent(estFuturePercentReward * 365),
  [titles.allocationsEffectiveness]: allocationsEffectiveness,
});
