import { divideBy1e18 } from "../../../../../../utils/number.utils";

export type CuratorDetails = {
  id: string;
  currentNameSignalCount: number;
  currentSignalCount: number;
  allCurrentGRTValue: string;
  totalNameSignalledTokens: string;
  totalNameUnsignalledTokens: string;
};

export const transform = ({
  currentNameSignalCount,
  currentSignalCount,
  allCurrentGRTValue,
  totalNameSignalledTokens,
  totalNameUnsignalledTokens,
}: CuratorDetails) => {
  const currentSignaledGRT = divideBy1e18(allCurrentGRTValue);
  const signaledTotal = divideBy1e18(totalNameSignalledTokens);
  const unsignaledTotal = divideBy1e18(totalNameUnsignalledTokens);

  return {
    subgraphsCount: currentNameSignalCount + currentSignalCount,
    currentSignaledGRT,
    signaledTotal,
    unsignaledTotal,
    PLGrt: unsignaledTotal + currentSignaledGRT - signaledTotal,
  };
};
