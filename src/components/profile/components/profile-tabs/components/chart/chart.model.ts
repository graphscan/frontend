import { PlotData } from "plotly.js";

export type CartesianChartItem = Partial<PlotData> & {
  x: Array<number | string>;
  y: Array<number | string>;
};
