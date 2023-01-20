import { ColumnType } from 'antd/es/table';
import {
  createTitleWithTooltipDescription,
  renderAccountId,
  renderFormattedValue,
} from '../../../../../../utils/table.utils';
import { divideBy1e18 } from '../../../../../../utils/number.utils';

export type CuratorLite = {
  id: string;
  activeNameSignalCount: number;
  activeSignalCount: number;
  totalNameSignalledTokens: string;
  totalNameUnsignalledTokens: string;
};

export type CuratorsRowLite = {
  id: string;
  key: string;
  nameSignalCount: number;
  totalNameSignalledTokens: number;
  totalNameUnsignalledTokens: number;
};

const titles: Record<Exclude<keyof CuratorsRowLite, 'key'>, string> = {
  id: 'Curator Address',
  nameSignalCount: 'Subgraphs',
  totalNameSignalledTokens: 'Signaled Tokens',
  totalNameUnsignalledTokens: 'Unsignaled Tokens',
};

export const columnsWidth = {
  '2560': [193, 624, 624, 624],
  '1920': [172, 423, 423, 422],
  '1440': [151, 377, 376, 376],
  '1280': [136, 350, 349, 349],
};

export const columns: Array<ColumnType<CuratorsRowLite>> = [
  {
    title: createTitleWithTooltipDescription(titles.id, 'The curator’s Ethereum address or ENS.'),
    dataIndex: 'id',
    key: 'id',
    render: renderAccountId('curator-details'),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.nameSignalCount,
      'Subgraphs that are currently signaled by Curator.',
    ),
    dataIndex: 'nameSignalCount',
    key: 'nameSignalCount',
  },
  {
    title: createTitleWithTooltipDescription(
      titles.totalNameSignalledTokens,
      'Sum of all-time signaled GRT.',
    ),
    dataIndex: 'totalNameSignalledTokens',
    key: 'totalNameSignalledTokens',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.totalNameUnsignalledTokens,
      'Sum of all-time unsignaled GRT.',
    ),
    dataIndex: 'totalNameUnsignalledTokens',
    key: 'totalNameUnsignalledTokens',
    render: renderFormattedValue,
  },
];

export const transformToRow = ({
  id,
  activeNameSignalCount,
  activeSignalCount,
  totalNameSignalledTokens,
  totalNameUnsignalledTokens,
}: CuratorLite): CuratorsRowLite => ({
  id,
  key: id,
  nameSignalCount: activeNameSignalCount + activeSignalCount,
  totalNameSignalledTokens: divideBy1e18(totalNameSignalledTokens),
  totalNameUnsignalledTokens: divideBy1e18(totalNameUnsignalledTokens),
});

export const transformToCsvRow = ({
  id,
  nameSignalCount,
  totalNameSignalledTokens,
  totalNameUnsignalledTokens,
}: CuratorsRowLite) => ({
  [titles.id]: id,
  [titles.nameSignalCount]: nameSignalCount,
  [titles.totalNameSignalledTokens]: totalNameSignalledTokens,
  [titles.totalNameUnsignalledTokens]: totalNameUnsignalledTokens,
});
