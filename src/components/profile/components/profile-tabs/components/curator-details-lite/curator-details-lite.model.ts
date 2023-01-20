import { divideBy1e18 } from '../../../../../../utils/number.utils';

export type CuratorDetailsLite = {
  id: string;
  activeNameSignalCount: number;
  activeSignalCount: number;
  totalNameSignalledTokens: string;
  totalNameUnsignalledTokens: string;
};

export const transform = ({
  activeNameSignalCount,
  activeSignalCount,
  totalNameSignalledTokens,
  totalNameUnsignalledTokens,
}: CuratorDetailsLite) => {
  return {
    subgraphsCount: activeNameSignalCount + activeSignalCount,
    signaledTotal: divideBy1e18(totalNameSignalledTokens),
    unsignaledTotal: divideBy1e18(totalNameUnsignalledTokens),
  };
};
