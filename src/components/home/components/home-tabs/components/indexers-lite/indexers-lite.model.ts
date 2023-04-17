import { ColumnType } from 'antd/es/table';
import { divide, subtract, map } from 'ramda';
import { GraphNetwork } from '../../../../../../model/graph-network.model';
import { getEstimatedRewards } from '../../../../../../model/indexers.model';
import {
  createTitleWithTooltipDescription,
  renderAccountId,
  renderFormattedValue,
  renderFormattedRealValue,
  renderFormattedToPercentOfYearValue,
  renderFormattedValueWithPercentageTooltip,
  renderFormattedToPercentValueWithSeparatedValuesInTooltip,
} from '../../../../../../utils/table.utils';
import { formatNumberToPercent, divideBy1e18, divideBy1e6 } from '../../../../../../utils/number.utils';

export type IndexerLite = {
  id: string;
  defaultDisplayName: string | null;
  stakedTokens: string;
  lockedTokens: string;
  delegatedTokens: string;
  allocatedTokens: string;
  indexingRewardEffectiveCut: string;
  queryFeeEffectiveCut: string;
  queryFeeCut: number;
  indexingRewardCut: number;
  allocations: Array<{
    id: string;
    allocatedTokens: string;
    subgraphDeployment: {
      id: string;
      signalledTokens: string;
      stakedTokens: string;
      deniedAt: number;
    };
  }>;
};

export type IndexersTransformerConfigLite = {
  plannedDelegation: string;
  plannedIndexerCut: string | null;
  favourites: Map<string, number>;
};

export type IndexersRowLite = {
  id: string;
  key: string;
  name: string | null;
  indexingRewardCut: number;
  queryFeeCut: number;
  selfStaked: number;
  delegationPool: number;
  allocatedTokens: number;
  delegationRemaining: number;
  estFuturePercentReward: number;
  estFutureRewardPerDay: number;
  indexingRewardEffectiveCut: number | null;
  queryFeeEffectiveCut: number | null;
  allocationRate: number;
  favourite: boolean;
};

const titles: Record<
  Exclude<
    keyof IndexersRowLite,
    'key' | 'name' | 'indexingRewardCut' | 'queryFeeCut' | 'allocationRate' | 'favourite'
  >,
  string
> = {
  id: 'Indexer Address',
  indexingRewardEffectiveCut: 'Effective reward cut',
  queryFeeEffectiveCut: 'Effective Query fee cut',
  selfStaked: 'Self Stake',
  delegationPool: 'Delegation Pool',
  allocatedTokens: 'Allocated',
  delegationRemaining: 'Remain for Delegation',
  estFuturePercentReward: 'Estimated APR',
  estFutureRewardPerDay: 'Estimated daily reward, GRT',
};

export const columnsWidth = {
  '2560': [48, 196, 227, 227, 227, 228, 228, 228, 228, 228],
  '1920': [48, 172, 151, 151, 151, 151, 151, 151, 152, 162],
  '1440': [48, 155, 133, 133, 133, 133, 133, 133, 134, 145],
  '1280': [48, 136, 124, 124, 124, 124, 124, 124, 125, 131],
};

export const columns: Array<ColumnType<IndexersRowLite>> = [
  {
    title: createTitleWithTooltipDescription(titles.id, 'The indexer’s Ethereum address or ENS.'),
    dataIndex: 'id',
    key: 'id',
    fixed: 'left',
    render: renderAccountId('indexer-details'),
    onCell: () => ({ className: 'ant-table-cell_left-aligned' }),
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
    dataIndex: 'indexingRewardEffectiveCut',
    key: 'indexingRewardEffectiveCut',
    render: renderFormattedToPercentValueWithSeparatedValuesInTooltip(
      'Indexing Reward Cut',
      'indexingRewardCut',
    ),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.queryFeeEffectiveCut,
      'Effective Query fee cut  is a fee that Indexer charges Delegators for delegations management.',
    ),
    dataIndex: 'queryFeeEffectiveCut',
    key: 'queryFeeEffectiveCut',
    render: renderFormattedToPercentValueWithSeparatedValuesInTooltip('Query Fee Cut', 'queryFeeCut'),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.selfStaked,
      `The Indexer's deposited stake, which may be slashed for malicious or incorrect behavior.`,
    ),
    dataIndex: 'selfStaked',
    key: 'selfStaked',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.delegationPool,
      'Stake from Delegators which can be allocated by the Indexer, but cannot be slashed.',
    ),
    dataIndex: 'delegationPool',
    key: 'delegationPool',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.allocatedTokens,
      'Stake that Indexers are actively allocating towards the subgraphs they are indexing.',
    ),
    dataIndex: 'allocatedTokens',
    key: 'allocatedTokens',
    render: renderFormattedValueWithPercentageTooltip('allocationRate'),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.delegationRemaining,
      'Amount of GRT that can be delegated to Indexer  without exceeding Indexer’s max capacity.',
    ),
    dataIndex: 'delegationRemaining',
    key: 'delegationRemaining',
    render: renderFormattedRealValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.estFuturePercentReward,
      `
        APR based on size of your potential delegation.
        <br><br>Calculated for 10,000 GRT by default. Use the "Rewards settings" to change it.
        <br><br>APR (Annual Percentage Rate) is expressed as a percentage that represents the actual yearly 
        cost of funds over the term of an income earned on an investment.
      `,
    ),
    dataIndex: 'estFuturePercentReward',
    key: 'estFuturePercentReward',
    render: renderFormattedToPercentOfYearValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.estFutureRewardPerDay,
      `
        Calculated estimated rewards per day based on the amount of your potential delegation.
        <br><br>Calculated for 10,000 GRT by default. Use the Calculator to change it.
      `,
    ),
    dataIndex: 'estFutureRewardPerDay',
    key: 'estFutureRewardPerDay',
    render: renderFormattedValue,
  },
];

export const transformToRows = ({
  plannedDelegation,
  plannedIndexerCut,
  favourites,
  indexers,
  networkData: { networkGRTIssuance, totalSupply, totalTokensAllocated, totalTokensSignalled },
}: IndexersTransformerConfigLite & {
  indexers: Array<IndexerLite>;
  networkData: GraphNetwork;
}): Array<IndexersRowLite> => {
  const transformToRow = ({
    id,
    defaultDisplayName,
    stakedTokens: _stakedTokens,
    lockedTokens: _lockedTokens,
    delegatedTokens,
    allocatedTokens: _allocatedTokens,
    indexingRewardEffectiveCut,
    queryFeeEffectiveCut,
    queryFeeCut,
    indexingRewardCut: _indexingRewardCut,
    allocations,
  }: IndexerLite): IndexersRowLite => {
    const delegations = divideBy1e18(delegatedTokens);
    const indexingRewardCut = divideBy1e6(_indexingRewardCut);
    const allocatedTokens = divideBy1e18(_allocatedTokens);
    const allocationRate = divide(Number(_allocatedTokens), Number(totalTokensAllocated));
    const stakedTokens = divideBy1e18(_stakedTokens);
    const lockedTokens = divideBy1e18(_lockedTokens);
    const selfStaked = subtract(stakedTokens, lockedTokens);
    const delegationRemaining = selfStaked * 16 - delegations;

    const finalCut = plannedIndexerCut
      ? (selfStaked + (parseFloat(plannedIndexerCut) / 100) * delegations) / (selfStaked + delegations)
      : null;

    const { estFuturePercentReward, estFutureReward } = getEstimatedRewards({
      delegations,
      delegationRemaining,
      indexingRewardCut: finalCut ?? indexingRewardCut,
      allocatedTokens: _allocatedTokens,
      futureDelegation: plannedDelegation,
      networkData: { networkGRTIssuance, totalSupply, totalTokensSignalled },
      allocations,
    });

    return {
      id,
      key: id,
      name: defaultDisplayName,
      indexingRewardCut,
      queryFeeCut: divideBy1e6(queryFeeCut),
      selfStaked,
      delegationPool: delegations,
      allocatedTokens,
      delegationRemaining,
      estFuturePercentReward: delegations > 0 ? estFuturePercentReward : 0,
      estFutureRewardPerDay: delegations > 0 ? estFutureReward : 0,
      allocationRate,
      queryFeeEffectiveCut: delegations > 0 ? Number(queryFeeEffectiveCut) : null,
      indexingRewardEffectiveCut: delegations > 0 ? Number(indexingRewardEffectiveCut) : null,
      favourite: favourites.has(id),
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
  estFuturePercentReward,
  estFutureRewardPerDay,
  allocationRate,
  queryFeeEffectiveCut,
  indexingRewardEffectiveCut,
}: IndexersRowLite) => ({
  [titles.id]: name ?? id,
  [titles.indexingRewardEffectiveCut]:
    typeof indexingRewardEffectiveCut === 'number'
      ? `${formatNumberToPercent(indexingRewardEffectiveCut)} | ${formatNumberToPercent(indexingRewardCut)}`
      : null,
  [titles.queryFeeEffectiveCut]:
    typeof queryFeeEffectiveCut === 'number'
      ? `${formatNumberToPercent(queryFeeEffectiveCut)} | ${formatNumberToPercent(queryFeeCut)}`
      : null,
  [titles.selfStaked]: selfStaked,
  [titles.delegationPool]: delegationPool,
  [titles.allocatedTokens]: `${allocatedTokens} (${formatNumberToPercent(allocationRate)})`,
  [titles.delegationRemaining]: delegationRemaining,
  [titles.estFuturePercentReward]: `${formatNumberToPercent(estFuturePercentReward * 365)}`,
  [titles.estFutureRewardPerDay]: estFutureRewardPerDay,
});
