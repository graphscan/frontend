import { add, divide, multiply, subtract, sum } from 'ramda';
import { GraphNetwork, getInflationPerDay } from './graph-network.model';
import { divideBy1e18 } from '../utils/number.utils';

export const getEstimatedRewards = ({
  delegations,
  delegationRemaining,
  indexingRewardCut,
  allocatedTokens: _allocatedTokens,
  futureDelegation,
  networkData: { networkGRTIssuance, totalSupply, totalTokensSignalled },
  allocations,
}: {
  delegations: number;
  delegationRemaining: number;
  indexingRewardCut: number;
  allocatedTokens: string;
  futureDelegation: string;
  networkData: Pick<GraphNetwork, 'networkGRTIssuance' | 'totalSupply' | 'totalTokensSignalled'>;
  allocations: Array<{
    id: string;
    allocatedTokens: string;
    subgraphDeployment: {
      id: string;
      signalledTokens: string;
      stakedTokens: string;
      deniedAt: number;
    };
  }>;
}) => {
  const indexerReward = (extra: number) => {
    let extraAllocation = extra;
    const extraDelegationsRemaining = subtract(delegationRemaining, extra);

    if (extraDelegationsRemaining < 0) {
      extraAllocation = delegationRemaining < 0 ? 0 : delegationRemaining;
    }

    return sum(
      allocations.map((a) => {
        const subRate = divide(Number(a.allocatedTokens), Number(_allocatedTokens));
        const subAllocatedTokens = add(Number(a.allocatedTokens), multiply(extraAllocation, subRate));
        const subTotalAllocated = add(
          Number(a.subgraphDeployment.stakedTokens),
          multiply(extraAllocation, subRate),
        );
        const signaled = Number(a.subgraphDeployment.signalledTokens);
        const part = divide(signaled, Number(totalTokensSignalled));

        return a.subgraphDeployment.deniedAt > 0
          ? 0
          : multiply(
              divide(subAllocatedTokens, subTotalAllocated),
              multiply(part, getInflationPerDay({ totalSupply, networkGRTIssuance })),
            );
      }),
    );
  };

  let estRewardsPerDay = 0;
  let estFutureReward = 0;
  let estFuturePercentReward = 0;

  if (delegations > 0) {
    estRewardsPerDay = multiply(subtract(1, indexingRewardCut), indexerReward(0));
  }

  if (Number(futureDelegation) > 0) {
    const futureDelegations = Number(futureDelegation) + delegations;
    estRewardsPerDay = multiply(subtract(1, indexingRewardCut), indexerReward(Number(futureDelegation)));
    estFuturePercentReward = divideBy1e18(divide(estRewardsPerDay, futureDelegations));
    estFutureReward = estFuturePercentReward * Number(futureDelegation);
  }

  return {
    estFuturePercentReward,
    estFutureReward,
  };
};

export const HISTORY_APY_REQUEST_TIME_STORAGE_KEY = 'history-apy-request-time';
