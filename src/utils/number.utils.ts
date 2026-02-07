import numbro from "numbro";

export const shouldBeRounded = (value: number) => Math.abs(value) >= 1000;

export const formatNumber = (value: number, mantissa = 1) =>
  numbro(value)
    .format({
      average: true,
      mantissa,
    })
    .toUpperCase();

export const formatNumberToPercent = (
  value: number,
  mantissa = 1,
  average = true,
) =>
  Math.abs(value) < 1000
    ? numbro(value)
        .format({
          output: "percent",
          average,
          mantissa,
        })
        .toUpperCase()
    : `${value < 0 ? "< -" : "> "}100K%`;

export const formatPercents = (value: number) => {
  const percents = value * 100;
  return Math.abs(percents) > 100000
    ? `${percents < 100000 ? "<" : ">"} 100K`
    : formatNumber(percents);
};

export const formatTableNumber = (value: number) =>
  numbro(value)
    .format(
      Math.abs(value) >= 1e6
        ? {
            average: true,
            mantissa: 1,
            forceAverage: "million",
          }
        : Math.abs(value) >= 1e4
          ? {
              average: true,
              mantissa: 1,
              forceAverage: "thousand",
            }
          : {
              average: true,
              mantissa: 1,
            },
    )
    .toUpperCase();

export const separateThousands = (value: number) => {
  const parts =
    Math.abs(value) > 1
      ? String(value.toFixed(2)).split(".")
      : value.toPrecision(2).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  parts[1] =
    typeof parts[1] === "undefined"
      ? "00"
      : parts[1].length < 2
        ? `${parts[1]}0`
        : parts[1];
  return parts.join(".");
};

export const formatTooltipNumber = (value: number) => separateThousands(value);

export const divideBy1e18 = (value: string | number) => Number(value) / 1e18;

export const divideBy1e6 = (value: string | number) => Number(value) / 1e6;
