import { NetworkStats } from "./network-stats.model";
import { calculateMaxDailyIssuance } from "../utils/daily-issuance.utils";
import { getEnvVariables } from "../utils/env.utils";

export const TECHNICAL_PARTNERS = getEnvVariables().partners;

export type IndexersAllocation = {
  id: string;
  allocatedTokens: string;
  provision: { id: string; indexingRewardsCut: string } | null;
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
    "networkGRTIssuancePerBlock" | "totalTokensSignalled"
  > & { minimumSubgraphSignal?: string };
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
    minimumSubgraphSignal = "0",
  },
  allocations,
}: GetEstimatedRewardsParams) => {
  const planned = Math.max(0, Number(plannedDelegation));
  const futureDelegations = planned + delegationPool;
  const totalSignal = Number(totalTokensSignalled);
  const totalAllocated = Number(_allocatedTokens);
  if (futureDelegations <= 0 || totalSignal <= 0 || totalAllocated <= 0) {
    return { estFuturePercentReward: 0, estFutureReward: 0 };
  }

  // This is RewardsManager's allocated issuance, already reduced by the
  // IssuanceAllocator (e.g. GIP-0089). Do not apply the 80% split again.
  const dailyIssuance = calculateMaxDailyIssuance(
    Number(networkGRTIssuancePerBlock),
  );
  const extraAllocation =
    Math.min(planned, Math.max(0, delegationRemaining)) * 1e18;
  const estRewardsPerDay = allocations.reduce((rewards, allocation) => {
    const deployment = allocation.subgraphDeployment;
    if (
      deployment.deniedAt > 0 ||
      Number(deployment.signalledTokens) < Number(minimumSubgraphSignal)
    )
      return rewards;

    const extra =
      (extraAllocation * Number(allocation.allocatedTokens)) / totalAllocated;
    const deploymentStake = Number(deployment.stakedTokens) + extra;
    if (deploymentStake <= 0) return rewards;

    // The mappings normalize Horizon's on-chain delegator cut to the
    // indexer's cut, despite the Provision schema's outdated description.
    const cut = allocation.provision
      ? Number(allocation.provision.indexingRewardsCut) / 1e6
      : indexingRewardCut;
    // Denied signal is already included in totalSignal. Excluding denied
    // allocations above is sufficient; a second global discount is incorrect.
    const signalShare = Number(deployment.signalledTokens) / totalSignal;
    const allocationShare =
      (Number(allocation.allocatedTokens) + extra) / deploymentStake;
    return rewards + dailyIssuance * signalShare * allocationShare * (1 - cut);
  }, 0);
  const estFuturePercentReward = estRewardsPerDay / futureDelegations;
  const estFutureReward = estFuturePercentReward * planned;

  return {
    estFuturePercentReward,
    estFutureReward,
  };
};

export const HISTORY_APY_REQUEST_TIME_STORAGE_KEY = "history-apy-request-time";
