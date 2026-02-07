import { GraphNetwork } from "./graph-network.model";

export type NetworkStats = GraphNetwork & {
  deniedToTotalSignalledRatio: number;
};
