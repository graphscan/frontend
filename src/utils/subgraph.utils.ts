import { differenceInDays } from "date-fns";
import { divideBy1e18 } from "./number.utils";

export const isNewSubgraph = (createdAt: number) =>
  differenceInDays(Date.now(), createdAt * 1000) < 2;

export const calculateSubgraphProportion = ({
  subgraphSignals,
  subgraphAllocations,
  totalSignals,
  totalAllocations,
}: {
  subgraphSignals: string;
  subgraphAllocations: string;
  totalSignals: string;
  totalAllocations: string;
}) => {
  return (
    divideBy1e18(subgraphSignals) /
    divideBy1e18(totalSignals) /
    (divideBy1e18(subgraphAllocations) / divideBy1e18(totalAllocations))
  );
};
