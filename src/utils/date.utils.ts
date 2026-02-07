import { format } from "date-fns";
import { curry } from "ramda";

export const unixTimeToDateString = curry(
  (template: string, unixTime: number) =>
    format(new Date(unixTime * 1000), template),
);

export const formatToChartDate = (time: number | Date) =>
  format(time, "yyyy-MM-dd");

export const dateStringToUnixTime = (dateString: string) =>
  Date.parse(dateString) / 1000;

export const dhm = (t: number) => {
  const pad = (n: number) => (n < 10 ? `0${n}` : n);
  const cd = 24 * 60 * 60 * 1000;
  const ch = 60 * 60 * 1000;
  let d = Math.floor(t / cd);
  let h = Math.floor((t - d * cd) / ch);
  let m = Math.round((t - d * cd - h * ch) / 60000);
  if (m === 60) {
    h++;
    m = 0;
  }
  if (h === 24) {
    d++;
    h = 0;
  }
  return [`${pad(d)}d`, `${pad(h)}h`, `${pad(m)}m`].join(" ");
};
