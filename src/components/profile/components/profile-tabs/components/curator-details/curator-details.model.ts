import { divideBy1e18 } from '../../../../../../utils/number.utils';

export type CuratorDetails = {
  id: string;
  currentNameSignalCount: number;
  currentSignalCount: number;
  allCurrentGRTValue: string;
  totalNameSignalledTokens: string;
  totalNameUnsignalledTokens: string;
  PLGrt: string;
  realizedPLGrt: string;
  unrealizedPLGrt: string;
};

export const transform = ({
  currentNameSignalCount,
  currentSignalCount,
  allCurrentGRTValue,
  totalNameSignalledTokens,
  totalNameUnsignalledTokens,
  PLGrt,
  realizedPLGrt,
  unrealizedPLGrt,
}: CuratorDetails) => {
  return {
    subgraphsCount: currentNameSignalCount + currentSignalCount,
    currentSignaledGRT: divideBy1e18(allCurrentGRTValue),
    signaledTotal: divideBy1e18(totalNameSignalledTokens),
    unsignaledTotal: divideBy1e18(totalNameUnsignalledTokens),
    PLGrt: divideBy1e18(PLGrt),
    realizedPLGrt: divideBy1e18(realizedPLGrt),
    unrealizedPLGrt: divideBy1e18(unrealizedPLGrt),
  };
};
