import { PlotData } from 'plotly.js';

export type ChartItem = Partial<PlotData> & {
  x: Array<number | string>;
  y: Array<number | string>;
};
