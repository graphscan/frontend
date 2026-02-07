import { divideBy1e18 } from "./number.utils";

const AVG_BLOCKS_PER_DAY = 7150;

export const calculateMaxDailyIssuance = (networkGRTIssuancePerBlock: number) =>
  divideBy1e18(networkGRTIssuancePerBlock * AVG_BLOCKS_PER_DAY);

export const calculateDailyIssuance = ({
  networkGRTIssuancePerBlock,
  deniedToTotalSignalledRatio,
}: {
  networkGRTIssuancePerBlock: number;
  deniedToTotalSignalledRatio: number;
}) => {
  const maxDailyIssuance = calculateMaxDailyIssuance(
    networkGRTIssuancePerBlock,
  );

  return maxDailyIssuance - maxDailyIssuance * deniedToTotalSignalledRatio;
};
