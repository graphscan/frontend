import { ColumnType } from 'antd/es/table';
import {
  createTitleWithTooltipDescription,
  renderAccountId,
  renderFormattedValue,
  renderFormattedRealValue,
  renderDate,
  formatTableDate,
} from '../../../../../../utils/table.utils';
import { divideBy1e18 } from '../../../../../../utils/number.utils';

export type Curator = {
  id: string;
  currentNameSignalCount: number;
  currentSignalCount: number;
  allCurrentGRTValue: string;
  totalNameSignalledTokens: string;
  totalNameUnsignalledTokens: string;
  PLGrt: string;
  realizedPLGrt: string;
  unrealizedPLGrt: string;
  lastSignaledAt: number;
  lastUnsignaledAt: number;
};

export type CuratorsRow = {
  id: string;
  key: string;
  currentNameSignalCount: number;
  allCurrentGRTValue: number;
  totalNameSignalledTokens: number;
  totalNameUnsignalledTokens: number;
  PLGrt: number;
  realizedPLGrt: number;
  unrealizedPLGrt: number;
  lastSignaledAt: number;
  lastUnsignaledAt: number;
};

const titles: Record<Exclude<keyof CuratorsRow, 'key'>, string> = {
  id: 'Curator Address',
  currentNameSignalCount: 'Subgraphs',
  allCurrentGRTValue: 'Potential Signals Value',
  totalNameSignalledTokens: 'Signaled Tokens',
  totalNameUnsignalledTokens: 'Unsignaled Tokens',
  PLGrt: 'P/L GRT',
  realizedPLGrt: 'Realized P/L',
  unrealizedPLGrt: 'Unrealized P/L',
  lastSignaledAt: 'Last Signaled',
  lastUnsignaledAt: 'Last Unsignaled',
};

export const columnsWidth = {
  '2560': [193, 204, 204, 204, 204, 204, 204, 204, 222, 222],
  '1920': [172, 122, 130, 122, 122, 122, 122, 122, 203, 203],
  '1440': [151, 110, 120, 110, 110, 110, 110, 111, 174, 174],
  '1280': [136, 106, 106, 106, 106, 106, 106, 106, 153, 153],
};

export const columns: Array<ColumnType<CuratorsRow>> = [
  {
    title: createTitleWithTooltipDescription(titles.id, 'The curator’s Ethereum address or ENS.'),
    dataIndex: 'id',
    key: 'id',
    render: renderAccountId('curator-details'),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.currentNameSignalCount,
      'Subgraphs that are currently signaled by Curator.',
    ),
    dataIndex: 'currentNameSignalCount',
    key: 'currentNameSignalCount',
  },
  {
    title: createTitleWithTooltipDescription(
      titles.allCurrentGRTValue,
      'Current cost of the Curator signals.',
    ),
    dataIndex: 'allCurrentGRTValue',
    key: 'allCurrentGRTValue',
    render: renderFormattedValue,
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
  {
    title: createTitleWithTooltipDescription(titles.PLGrt, 'Realized Profit/Loss + Unrealized Profit/Loss.'),
    dataIndex: 'PLGrt',
    key: 'PLGrt',
    render: renderFormattedRealValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.realizedPLGrt,
      `
        Potential Curator profit/loss from Current Signals Value. Сalculated by the formula “Current cost of 
        signals minus GRTs spent on them”.
      `,
    ),
    dataIndex: 'realizedPLGrt',
    key: 'realizedPLGrt',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.unrealizedPLGrt,
      `
        Potential Curator profit/loss from <em>Current Signals Value</em>. Сalculated by the formula 
        “Current cost of signals minus GRTs spent on them”.
      `,
    ),
    dataIndex: 'unrealizedPLGrt',
    key: 'unrealizedPLGrt',
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(titles.lastSignaledAt),
    dataIndex: 'lastSignaledAt',
    key: 'lastSignaledAt',
    render: renderDate,
  },
  {
    title: createTitleWithTooltipDescription(titles.lastUnsignaledAt),
    dataIndex: 'lastUnsignaledAt',
    key: 'lastUnsignaledAt',
    render: renderDate,
  },
];

export const transformToRow = ({
  id,
  currentNameSignalCount,
  currentSignalCount,
  allCurrentGRTValue,
  totalNameSignalledTokens,
  totalNameUnsignalledTokens,
  PLGrt,
  realizedPLGrt,
  unrealizedPLGrt,
  lastSignaledAt,
  lastUnsignaledAt,
}: Curator): CuratorsRow => ({
  id,
  key: id,
  currentNameSignalCount: currentNameSignalCount + currentSignalCount,
  allCurrentGRTValue: divideBy1e18(allCurrentGRTValue),
  totalNameSignalledTokens: divideBy1e18(totalNameSignalledTokens),
  totalNameUnsignalledTokens: divideBy1e18(totalNameUnsignalledTokens),
  PLGrt: divideBy1e18(PLGrt),
  realizedPLGrt: divideBy1e18(realizedPLGrt),
  unrealizedPLGrt: divideBy1e18(unrealizedPLGrt),
  lastSignaledAt,
  lastUnsignaledAt,
});

export const transformToCsvRow = ({
  id,
  currentNameSignalCount,
  allCurrentGRTValue,
  totalNameSignalledTokens,
  totalNameUnsignalledTokens,
  PLGrt,
  realizedPLGrt,
  unrealizedPLGrt,
  lastSignaledAt,
  lastUnsignaledAt,
}: CuratorsRow) => ({
  [titles.id]: id,
  [titles.currentNameSignalCount]: currentNameSignalCount,
  [titles.allCurrentGRTValue]: allCurrentGRTValue,
  [titles.totalNameSignalledTokens]: totalNameSignalledTokens,
  [titles.totalNameUnsignalledTokens]: totalNameUnsignalledTokens,
  [titles.PLGrt]: PLGrt,
  [titles.realizedPLGrt]: realizedPLGrt,
  [titles.unrealizedPLGrt]: unrealizedPLGrt,
  [titles.lastSignaledAt]: lastSignaledAt ? formatTableDate(lastSignaledAt) : null,
  [titles.lastUnsignaledAt]: lastUnsignaledAt ? formatTableDate(lastUnsignaledAt) : null,
});
