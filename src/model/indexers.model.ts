import { add, divide, multiply, subtract, sum } from "ramda";
import { NetworkStats } from "./network-stats.model";
import { calculateDailyIssuance } from "../utils/daily-issuance.utils";
import { getEnvVariables } from "../utils/env.utils";
import { divideBy1e18 } from "../utils/number.utils";

export const TECHNICAL_PARTNERS = getEnvVariables().partners;

export type IndexersAllocation = {
  id: string;
  allocatedTokens: string;
  subgraphDeployment: {
    id: string;
    signalledTokens: string;
    stakedTokens: string;
    deniedAt: number;
  };
};

export type GetEstimatedRewardsParams = {
  delegationPool: number;
  delegationRemaining: number;
  indexingRewardCut: number;
  allocatedTokens: string;
  plannedDelegation: string;
  networkStats: Pick<
    NetworkStats,
    | "networkGRTIssuancePerBlock"
    | "totalTokensSignalled"
    | "deniedToTotalSignalledRatio"
  >;
  allocations: Array<IndexersAllocation>;
};

export const getEstimatedRewards = ({
  delegationPool,
  delegationRemaining,
  indexingRewardCut,
  allocatedTokens: _allocatedTokens,
  plannedDelegation,
  networkStats: {
    networkGRTIssuancePerBlock,
    totalTokensSignalled,
    deniedToTotalSignalledRatio,
  },
  allocations,
}: GetEstimatedRewardsParams) => {
  const getIndexerReward = (extra: number) => {
    let extraAllocation = extra;
    const extraDelegationsRemaining = subtract(delegationRemaining, extra);

    if (extraDelegationsRemaining < 0) {
      extraAllocation = delegationRemaining < 0 ? 0 : delegationRemaining;
    }

    return sum(
      allocations.map((a) => {
        const subRate = divide(
          Number(a.allocatedTokens),
          Number(_allocatedTokens),
        );
        const subAllocatedTokens = add(
          Number(a.allocatedTokens),
          multiply(extraAllocation, subRate),
        );
        const subTotalAllocated = add(
          Number(a.subgraphDeployment.stakedTokens),
          multiply(extraAllocation, subRate),
        );
        const signaled = Number(a.subgraphDeployment.signalledTokens);
        const part = (1e18 * signaled) / Number(totalTokensSignalled);

        return a.subgraphDeployment.deniedAt > 0
          ? 0
          : multiply(
              divide(subAllocatedTokens, subTotalAllocated),
              multiply(
                part,
                calculateDailyIssuance({
                  networkGRTIssuancePerBlock: Number(
                    networkGRTIssuancePerBlock,
                  ),
                  deniedToTotalSignalledRatio,
                }),
              ),
            );
      }),
    );
  };

  let estRewardsPerDay = 0;
  let estFutureReward = 0;
  let estFuturePercentReward = 0;

  const futureDelegations = Number(plannedDelegation) + delegationPool;

  if (futureDelegations > 0) {
    estRewardsPerDay = multiply(
      subtract(1, indexingRewardCut),
      getIndexerReward(Number(plannedDelegation)),
    );
    estFuturePercentReward = divideBy1e18(estRewardsPerDay / futureDelegations);
    estFutureReward = estFuturePercentReward * Number(plannedDelegation);
  }

  return {
    estFuturePercentReward,
    estFutureReward,
  };
};

export const HISTORY_APY_REQUEST_TIME_STORAGE_KEY = "history-apy-request-time";
