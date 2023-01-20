import { ColumnType } from 'antd/es/table';
import { SubgraphStates } from '../../../../../../model/subgraph-states.model';
import { divideBy1e18 } from '../../../../../../utils/number.utils';
import { isNewSubgraph } from '../../../../../../utils/subgraph.utils';
import {
  createTitleWithTooltipDescription,
  renderDeploymentId,
  renderSubgraphName,
  renderImage,
  renderFormattedValue,
  renderOwnerId,
} from '../../../../../../utils/table.utils';

type BaseSignal = {
  id: string;
  signalledTokens: string;
  unsignalledTokens: string;
};

type Subgraph = {
  id: string;
  active: boolean;
  image: string | null;
  displayName: string | null;
  createdAt: number;
  owner: {
    id: string;
  };
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

export type NameSignal = BaseSignal & {
  nameSignal: string;
  subgraph: Subgraph & {
    versions: Array<{
      id: string;
      createdAt: number;
    }>;
  };
};

export type Signal = BaseSignal & {
  signal: string;
  subgraphDeployment: {
    id: string;
    versions: Array<{
      id: string;
      subgraph: Subgraph;
    }>;
  };
};

export type CuratorSubgraphsRowLite = SubgraphStates & {
  id: string;
  key: string;
  img: string;
  ownerId: string;
  displayName: string;
  deploymentId: string | null;
  shares: number;
  signaledTotal: number;
  unsignaledTotal: number;
  type: 'Auto-Migrate' | 'Deployment Signal';
  versionId: string;
};

const titles: Record<
  Exclude<keyof CuratorSubgraphsRowLite, 'id' | 'key' | 'versionId' | keyof SubgraphStates>,
  string
> = {
  img: 'Img',
  displayName: 'Subgraph Name',
  ownerId: 'Owner',
  deploymentId: 'Deployment ID',
  type: 'Signal Type',
  shares: 'Shares',
  signaledTotal: 'Signaled Total',
  unsignaledTotal: 'Unsignaled Total',
};

export const columnsWidth = {
  '2560': [62, 215, 215, 233, 335, 335, 335, 335],
  '1920': [56, 192, 192, 197, 200, 201, 201, 201],
  '1440': [50, 168, 168, 175, 179, 180, 180, 180],
  '1280': [46, 150, 150, 154, 171, 171, 171, 171],
};

export const columns: Array<ColumnType<CuratorSubgraphsRowLite>> = [
  {
    title: createTitleWithTooltipDescription(titles.img),
    dataIndex: 'img',
    key: 'img',
    render: renderImage,
  },
  {
    title: createTitleWithTooltipDescription(titles.displayName),
    dataIndex: 'displayName',
    key: 'displayName',
    render: renderSubgraphName('versionId'),
    onCell: () => ({ className: 'ant-table-cell_with-link ant-table-cell_left-aligned' }),
  },
  {
    title: createTitleWithTooltipDescription(titles.ownerId),
    dataIndex: 'ownerId',
    key: 'ownerId',
    align: 'center',
    render: renderOwnerId,
  },
  {
    title: createTitleWithTooltipDescription(titles.deploymentId),
    dataIndex: 'deploymentId',
    key: 'deploymentId',
    onCell: () => ({ className: 'ant-table-cell_with-link' }),
    render: renderDeploymentId(),
  },
  {
    title: createTitleWithTooltipDescription(titles.type),
    dataIndex: 'type',
    key: 'type',
    align: 'center',
  },
  {
    title: createTitleWithTooltipDescription(
      titles.shares,
      `
        Shares are minted by depositing ("signaling") GRT into a subgraph's bonding curve and entitle the 
        holder to a share of the Curator commision on future query fees generated by the subgraph.
      `,
    ),
    dataIndex: 'shares',
    key: 'shares',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.signaledTotal,
      'All-time amount of GRT spent on signaling on chosen subgraph.',
    ),
    dataIndex: 'signaledTotal',
    key: 'signaledTotal',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.unsignaledTotal,
      'All-time amount of GRT received from unsignaling from chosen subgraph.',
    ),
    dataIndex: 'unsignaledTotal',
    key: 'unsignaledTotal',
    render: renderFormattedValue,
  },
];

type TypedNameSignal = NameSignal & {
  type: 'Auto-Migrate';
};

type TypedSignal = Signal & {
  type: 'Deployment Signal';
};

export const transformToRow = (typedSignal: TypedNameSignal | TypedSignal): CuratorSubgraphsRowLite => {
  const { id, signalledTokens, unsignalledTokens, type } = typedSignal;

  const baseSignal = {
    id,
    type,
    signaledTotal: divideBy1e18(signalledTokens),
    unsignaledTotal: divideBy1e18(unsignalledTokens),
  };

  if (typedSignal.type === 'Auto-Migrate') {
    const {
      id: subgraphId,
      active,
      image,
      displayName,
      owner,
      createdAt,
      currentVersion,
      versions,
    } = typedSignal.subgraph;
    const denied = currentVersion ? currentVersion.subgraphDeployment.deniedAt > 0 : false;
    return {
      ...baseSignal,
      id: subgraphId,
      key: id,
      img: image ?? '',
      displayName: displayName ?? '',
      ownerId: owner.id,
      deploymentId: currentVersion ? currentVersion.subgraphDeployment.id : null,
      shares: divideBy1e18(typedSignal.nameSignal),
      deprecated: !active || !currentVersion,
      denied,
      hasLinkedSubgraphs:
        !denied && active && currentVersion
          ? currentVersion.subgraphDeployment.versions.some(
              (x) =>
                x.subgraph.currentVersion &&
                x.subgraph.id !== subgraphId &&
                x.subgraphDeployment.id === currentVersion.subgraphDeployment.id,
            )
          : false,
      isNew: isNewSubgraph(createdAt),
      versionId: currentVersion?.id ?? [...versions].sort((a, b) => b.createdAt - a.createdAt)[0].id,
    };
  }

  const { id: deploymentId, versions } = typedSignal.subgraphDeployment;

  const [earliestActualVersion] = versions
    .filter(
      (v) => v.subgraph.currentVersion && v.subgraph.currentVersion.subgraphDeployment.id === deploymentId,
    )
    .sort((a, b) => a.subgraph.createdAt - b.subgraph.createdAt);
  const [lastPastVersion] = earliestActualVersion
    ? []
    : [...versions].sort((a, b) => b.subgraph.createdAt - a.subgraph.createdAt);
  const { id: versionId, subgraph } = earliestActualVersion ?? lastPastVersion;
  const denied = subgraph.currentVersion ? subgraph.currentVersion.subgraphDeployment.deniedAt > 0 : false;

  return {
    ...baseSignal,
    id,
    key: subgraph.id,
    img: subgraph.image ?? '',
    displayName: subgraph.displayName ?? '',
    ownerId: subgraph.owner.id,
    deploymentId: subgraph.currentVersion ? subgraph.currentVersion.subgraphDeployment.id : null,
    shares: divideBy1e18(typedSignal.signal),
    deprecated: !subgraph.active || !subgraph.currentVersion,
    denied,
    hasLinkedSubgraphs:
      !denied && subgraph.active && subgraph.currentVersion
        ? subgraph.currentVersion.subgraphDeployment.versions.some(
            (x) =>
              x.subgraph.currentVersion &&
              x.subgraph.id !== subgraph.id &&
              x.subgraphDeployment.id === subgraph.currentVersion?.subgraphDeployment.id,
          )
        : false,
    isNew: isNewSubgraph(subgraph.createdAt),
    versionId,
  };
};

export const transformToCsvRow = ({
  id,
  img,
  displayName,
  deploymentId,
  shares,
  signaledTotal,
  unsignaledTotal,
}: CuratorSubgraphsRowLite) => ({
  [titles.img]: img,
  [titles.displayName]: displayName,
  [titles.ownerId]: id,
  [titles.deploymentId]: deploymentId,
  [titles.shares]: shares,
  [titles.signaledTotal]: signaledTotal,
  [titles.unsignaledTotal]: unsignaledTotal,
});