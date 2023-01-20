import { divide, isNil } from 'ramda';
import { ColumnType } from 'antd/es/table';
import { AllocationsRewards, PotentialRewards } from '../../../../../../model/allocation-rewards.model';
import { SubgraphStates } from '../../../../../../model/subgraph-states.model';
import { dhm } from '../../../../../../utils/date.utils';
import { formatNumberToPercent, divideBy1e18, divideBy1e6 } from '../../../../../../utils/number.utils';
import { isNewSubgraph } from '../../../../../../utils/subgraph.utils';
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
  renderFormattedToPercentValue,
  renderFormattedToPercentValueWithSeparatedValuesInTooltip,
  renderHashId,
  renderDate,
  formatTableDate,
} from '../../../../../../utils/table.utils';

export type IndexerAllocation = {
  id: string;
  status: 'Active' | 'Closed' | 'Finalized' | 'Claimed';
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
  indexer: {
    id: string;
    indexingRewardCut: number;
    indexingRewardEffectiveCut: string;
  };
  subgraphDeployment: {
    id: string;
    versions: Array<{
      id: string;
      subgraph: {
        id: string;
        active: boolean;
        image: string | null;
        displayName: string | null;
        createdAt: number;
        currentVersion: {
          id: string;
          subgraphDeployment: {
            id: string;
            stakedTokens: string;
            signalledTokens: string;
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
    }>;
  };
};

export type IndexerAllocationsRow = SubgraphStates & {
  id: string;
  key: string;
  image: string | null;
  subgraphName: string | null;
  subgraphProportion: number;
  statusInt: 'Active' | 'Closed' | 'Finalized' | 'Claimed';
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
};

const titles: Record<
  Exclude<
    keyof IndexerAllocationsRow,
    | 'key'
    | 'subgraphId'
    | 'versionId'
    | 'indexingRewardCutAtClose'
    | 'potentialIndexingRewardCut'
    | 'lifetimeEpochs'
    | keyof SubgraphStates
  >,
  string
> = {
  image: 'Img',
  subgraphName: 'Subgraph',
  subgraphProportion: 'Subgraph Proportion',
  subgraphDeploymentId: 'Deployment ID',
  statusInt: 'Status',
  allocatedTokens: 'Allocated',
  createdAt: 'Created',
  closedAt: 'Closed',
  activeStateDuration: 'Active State Duration',
  indexingRewardEffectiveCutAtClose: 'Rewards Cut',
  indexingIndexerRewards: 'Indexer Rewards',
  indexingDelegatorRewards: ' Delegators Rewards',
  queryFeesCollected: 'Query Fees Collected',
  queryFeeRebates: 'Query Fees Rebates',
  id: 'Allocation ID',
  poi: 'POI',
};

export const columnsWidth = {
  '2560': [60, 215, 126, 215, 126, 126, 225, 225, 155, 126, 126, 126, 126, 126, 190, 190],
  '1920': [55, 190, 120, 190, 100, 100, 202, 202, 140, 112, 112, 112, 115, 115, 172, 172],
  '1440': [55, 168, 110, 168, 95, 95, 180, 180, 125, 100, 100, 100, 105, 105, 150, 150],
  '1280': [55, 153, 95, 153, 90, 90, 155, 155, 110, 90, 90, 90, 90, 90, 130, 130],
};

export const createColumns = (
  renderRewardsButton: (allocationId: string, potentialIndexingRewardCut: number) => void,
): Array<ColumnType<IndexerAllocationsRow>> => [
  {
    title: createTitleWithTooltipDescription(titles.image),
    dataIndex: 'image',
    key: 'image',
    render: renderImage,
  },
  {
    title: createTitleWithTooltipDescription(titles.subgraphName),
    dataIndex: 'subgraphName',
    key: 'subgraphName',
    render: renderSubgraphName('versionId'),
    onCell: () => ({ className: 'ant-table-cell_with-link ant-table-cell_left-aligned' }),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.subgraphProportion,
      'Current Signalled / Current Allocations for this subgraph.',
    ),
    dataIndex: 'subgraphProportion',
    key: 'subgraphProportion',
    render: renderFormattedToPercentValue(4, false),
  },
  {
    title: createTitleWithTooltipDescription(titles.subgraphDeploymentId),
    dataIndex: 'subgraphDeploymentId',
    key: 'subgraphDeploymentId',
    onCell: () => ({ className: 'ant-table-cell_with-link' }),
    render: renderDeploymentId(),
  },
  {
    title: createTitleWithTooltipDescription(titles.statusInt, allocationStatus.description),
    dataIndex: 'statusInt',
    key: 'statusInt',
    align: 'center',
    render: allocationStatus.render,
  },
  {
    title: createTitleWithTooltipDescription(titles.allocatedTokens),
    dataIndex: 'allocatedTokens',
    key: 'allocatedTokens',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(titles.createdAt),
    dataIndex: 'createdAt',
    key: 'createdAt',
    align: 'center',
    render: renderDate,
  },
  {
    title: createTitleWithTooltipDescription(titles.closedAt),
    dataIndex: 'closedAt',
    key: 'closedAt',
    align: 'center',
    render: renderDate,
  },
  {
    title: createTitleWithTooltipDescription(titles.activeStateDuration),
    dataIndex: 'activeStateDuration',
    key: 'activeStateDuration',
    render: renderLifetimeValue,
  },
  {
    title: createTitleWithTooltipDescription(titles.indexingRewardEffectiveCutAtClose),
    dataIndex: 'indexingRewardEffectiveCutAtClose',
    key: 'indexingRewardEffectiveCutAtClose',
    render: (value, row) =>
      value
        ? renderFormattedToPercentValueWithSeparatedValuesInTooltip(
            'Indexing Reward Cut',
            'indexingRewardCut',
          )(value, row)
        : value,
  },
  {
    title: createTitleWithTooltipDescription(titles.indexingIndexerRewards),
    dataIndex: 'indexingIndexerRewards',
    key: 'indexingIndexerRewards',
    render: (value, row) =>
      row.statusInt === 'Active'
        ? !isNil(value)
          ? renderFormattedValuePotential(value)
          : renderRewardsButton(row.id, row.potentialIndexingRewardCut)
        : renderFormattedValue(value),
  },
  {
    title: createTitleWithTooltipDescription(titles.indexingDelegatorRewards),
    dataIndex: 'indexingDelegatorRewards',
    key: 'indexingDelegatorRewards',
    render: (value, row) =>
      row.statusInt === 'Active'
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
    dataIndex: 'queryFeesCollected',
    key: 'queryFeesCollected',
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
    dataIndex: 'queryFeeRebates',
    key: 'queryFeeRebates',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(titles.id),
    dataIndex: 'id',
    key: 'id',
    align: 'center',
    render: renderHashId,
  },
  {
    title: createTitleWithTooltipDescription(titles.poi, poi.description),
    dataIndex: 'poi',
    key: 'poi',
    render: poi.render,
    align: 'center',
  },
];

export const createTransformerToRow = (
  {
    allocationsRewards,
    currentEpoch,
  }: {
    allocationsRewards: AllocationsRewards;
    currentEpoch: number;
  } = { allocationsRewards: {}, currentEpoch: 0 },
) => ({
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
  indexer,
  subgraphDeployment: { id: deploymentId, versions },
}: IndexerAllocation): IndexerAllocationsRow => {
  const [earliestActualVersion] = versions
    .filter(
      (v) => v.subgraph.currentVersion && v.subgraph.currentVersion.subgraphDeployment.id === deploymentId,
    )
    .sort((a, b) => a.subgraph.createdAt - b.subgraph.createdAt);

  const [lastPastVersion] = earliestActualVersion
    ? []
    : [...versions].sort((a, b) => b.subgraph.createdAt - a.subgraph.createdAt);

  const rewards: PotentialRewards | undefined = allocationsRewards[id];

  const denied = earliestActualVersion?.subgraph.currentVersion
    ? earliestActualVersion.subgraph.currentVersion.subgraphDeployment.deniedAt > 0
    : false;

  return {
    id,
    key: id,
    image: earliestActualVersion?.subgraph.image ?? lastPastVersion.subgraph.image,
    subgraphName: earliestActualVersion?.subgraph.displayName ?? lastPastVersion.subgraph.displayName,
    subgraphProportion:
      earliestActualVersion &&
      Number(earliestActualVersion.subgraph.currentVersion?.subgraphDeployment.stakedTokens)
        ? divide(
            Number(earliestActualVersion.subgraph.currentVersion?.subgraphDeployment.signalledTokens),
            Number(earliestActualVersion.subgraph.currentVersion?.subgraphDeployment.stakedTokens),
          )
        : 0,
    subgraphDeploymentId: deploymentId,
    statusInt: status,
    allocatedTokens: divideBy1e18(allocatedTokens),
    createdAt,
    closedAt,
    activeStateDuration: dhm((closedAt ? closedAt * 1000 : Date.now()) - createdAt * 1000),
    indexingRewardEffectiveCutAtClose:
      status === 'Active' && rewards
        ? Number(indexer.indexingRewardEffectiveCut)
        : typeof indexingRewardEffectiveCutAtClose === 'string'
        ? Number(indexingRewardEffectiveCutAtClose)
        : null,
    indexingRewardCutAtClose:
      status === 'Active' && rewards
        ? divideBy1e6(indexer.indexingRewardCut)
        : typeof indexingRewardCutAtClose === 'number'
        ? divideBy1e6(indexingRewardCutAtClose)
        : null,
    indexingIndexerRewards:
      status === 'Active' ? rewards?.potentialIndexerRewards : divideBy1e18(indexingIndexerRewards),
    indexingDelegatorRewards:
      status === 'Active' ? rewards?.potentialDelegatorRewards : divideBy1e18(indexingDelegatorRewards),
    potentialIndexingRewardCut: divideBy1e6(indexer.indexingRewardCut),
    queryFeesCollected: divideBy1e18(queryFeesCollected),
    queryFeeRebates: divideBy1e18(queryFeeRebates),
    poi,
    subgraphId: earliestActualVersion?.subgraph.id ?? lastPastVersion.subgraph.id,
    versionId: earliestActualVersion?.id ?? lastPastVersion.id,
    deprecated: !earliestActualVersion || !earliestActualVersion.subgraph.active,
    denied,
    hasLinkedSubgraphs:
      !denied && earliestActualVersion?.subgraph.currentVersion && earliestActualVersion.subgraph.active
        ? earliestActualVersion.subgraph.currentVersion.subgraphDeployment.versions.some(
            (x) =>
              x.subgraph.currentVersion &&
              x.subgraph.id !== earliestActualVersion.subgraph.id &&
              x.subgraphDeployment.id ===
                earliestActualVersion.subgraph.currentVersion?.subgraphDeployment.id,
          )
        : false,
    isNew: isNewSubgraph(earliestActualVersion?.subgraph.createdAt ?? 0),
    lifetimeEpochs: (closedAtEpoch ?? currentEpoch) - createdAtEpoch,
  };
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
}: IndexerAllocationsRow) => ({
  [titles.image]: image,
  [titles.subgraphName]: subgraphName,
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
