import { format, sub } from "date-fns";
import { dateStringToUnixTime } from "./date.utils";

export const formatToChartDate = (time: number | Date) =>
  format(time, "yyyy-MM-dd");

export const getInitialPeriod = (
  monthsBefore = 1,
  to = Date.now(),
): [from: string, to: string] => [
  formatToChartDate(sub(new Date(), { months: monthsBefore })),
  formatToChartDate(to),
];

export const chartRangeToUnixTime = (
  range: [from: string, to: string],
): [from: number, to: number] => [
  Math.floor(dateStringToUnixTime(range[0])),
  Math.ceil(dateStringToUnixTime(range[1])),
];
