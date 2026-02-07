import { ColumnType } from "antd/es/table";
import {
  createTitleWithTooltipDescription,
  renderAccountId,
  renderFormattedValue,
  renderFormattedRealValue,
  renderDate,
  formatTableDate,
} from "../../../../../../utils/table.utils";
import { divideBy1e18 } from "../../../../../../utils/number.utils";

export type Curator = {
  id: string;
  currentNameSignalCount: number;
  currentSignalCount: number;
  allCurrentGRTValue: string;
  totalNameSignalledTokens: string;
  totalNameUnsignalledTokens: string;
};

export type CuratorWithTimestamps = Curator & {
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
  lastSignaledAt: number;
  lastUnsignaledAt: number;
};

const titles: Record<Exclude<keyof CuratorsRow, "key">, string> = {
  id: "Curator Address",
  currentNameSignalCount: "Subgraphs",
  allCurrentGRTValue: "Potential Signals Value",
  totalNameSignalledTokens: "Signaled Tokens",
  totalNameUnsignalledTokens: "Unsignaled Tokens",
  PLGrt: "P/L GRT",
  lastSignaledAt: "Last Signaled",
  lastUnsignaledAt: "Last Unsignaled",
};

export const columnsWidth = {
  "2560": [193, 204, 260, 260, 260, 260, 264, 264],
  "1920": [172, 140, 180, 180, 180, 180, 204, 204],
  "1440": [151, 125, 160, 160, 160, 160, 182, 182],
  "1280": [136, 115, 145, 145, 145, 145, 177, 176],
};

export const columns: Array<ColumnType<CuratorsRow>> = [
  {
    title: createTitleWithTooltipDescription(
      titles.id,
      "The curator's Ethereum address or ENS.",
    ),
    dataIndex: "id",
    key: "id",
    render: renderAccountId("curator-details"),
  },
  {
    title: createTitleWithTooltipDescription(
      titles.currentNameSignalCount,
      "Subgraphs that are currently signaled by Curator.",
    ),
    dataIndex: "currentNameSignalCount",
    key: "currentNameSignalCount",
  },
  {
    title: createTitleWithTooltipDescription(
      titles.allCurrentGRTValue,
      "Current cost of the Curator signals.",
    ),
    dataIndex: "allCurrentGRTValue",
    key: "allCurrentGRTValue",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.totalNameSignalledTokens,
      "Sum of all-time signaled GRT.",
    ),
    dataIndex: "totalNameSignalledTokens",
    key: "totalNameSignalledTokens",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.totalNameUnsignalledTokens,
      "Sum of all-time unsignaled GRT.",
    ),
    dataIndex: "totalNameUnsignalledTokens",
    key: "totalNameUnsignalledTokens",
    render: renderFormattedValue,
  },
  {
    title: createTitleWithTooltipDescription(
      titles.PLGrt,
      "Unsignaled Tokens + Potential Signals Value - Signaled Tokens.",
    ),
    dataIndex: "PLGrt",
    key: "PLGrt",
    render: renderFormattedRealValue,
  },
  {
    title: createTitleWithTooltipDescription(titles.lastSignaledAt),
    dataIndex: "lastSignaledAt",
    key: "lastSignaledAt",
    render: renderDate,
  },
  {
    title: createTitleWithTooltipDescription(titles.lastUnsignaledAt),
    dataIndex: "lastUnsignaledAt",
    key: "lastUnsignaledAt",
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
  lastSignaledAt,
  lastUnsignaledAt,
}: CuratorWithTimestamps): CuratorsRow => {
  const allCurrentGRTValueNum = divideBy1e18(allCurrentGRTValue);
  const totalNameSignalledTokensNum = divideBy1e18(totalNameSignalledTokens);
  const totalNameUnsignalledTokensNum = divideBy1e18(
    totalNameUnsignalledTokens,
  );

  return {
    id,
    key: id,
    currentNameSignalCount: currentNameSignalCount + currentSignalCount,
    allCurrentGRTValue: allCurrentGRTValueNum,
    totalNameSignalledTokens: totalNameSignalledTokensNum,
    totalNameUnsignalledTokens: totalNameUnsignalledTokensNum,
    PLGrt:
      totalNameUnsignalledTokensNum +
      allCurrentGRTValueNum -
      totalNameSignalledTokensNum,
    lastSignaledAt,
    lastUnsignaledAt,
  };
};

export const transformToCsvRow = ({
  id,
  currentNameSignalCount,
  allCurrentGRTValue,
  totalNameSignalledTokens,
  totalNameUnsignalledTokens,
  PLGrt,
  lastSignaledAt,
  lastUnsignaledAt,
}: CuratorsRow) => ({
  [titles.id]: id,
  [titles.currentNameSignalCount]: currentNameSignalCount,
  [titles.allCurrentGRTValue]: allCurrentGRTValue,
  [titles.totalNameSignalledTokens]: totalNameSignalledTokens,
  [titles.totalNameUnsignalledTokens]: totalNameUnsignalledTokens,
  [titles.PLGrt]: PLGrt,
  [titles.lastSignaledAt]: lastSignaledAt
    ? formatTableDate(lastSignaledAt)
    : null,
  [titles.lastUnsignaledAt]: lastUnsignaledAt
    ? formatTableDate(lastUnsignaledAt)
    : null,
});
