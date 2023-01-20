import { formatTableDate } from '../../../../../../utils/table.utils';
import { divideBy1e18 } from '../../../../../../utils/number.utils';

export type DelegatorLite = {
  id: string;
  activeStakesCount: number;
  totalStakedTokens: string;
  totalUnstakedTokens: string;
  totalRealizedRewards: string;
  lastDelegationAt: [{ id: string; lastDelegatedAt: number | null }?];
  lastUnDelegationAt: [{ id: string; lastUndelegatedAt: number | null }?];
  realizedRewards: string;
};

export type DelegatedStakeLite = {
  id: string;
  personalExchangeRate: string;
  shareAmount: string;
  indexer: {
    delegationExchangeRate: string;
  };
};

export const transformDelegatorDetails = ({
  activeStakesCount,
  totalStakedTokens,
  totalUnstakedTokens,
  totalRealizedRewards,
  delegatedStakes,
  lastDelegationAt: [lastDelegation],
  lastUnDelegationAt: [lastUndelegation],
}: DelegatorLite & { delegatedStakes: Array<DelegatedStakeLite> }) => {
  const realizedRewards = divideBy1e18(totalRealizedRewards);
  const unrealizedRewards = divideBy1e18(
    delegatedStakes.reduce(
      (acc, { indexer, personalExchangeRate, shareAmount }) =>
        acc + (Number(indexer.delegationExchangeRate) - Number(personalExchangeRate)) * Number(shareAmount),
      0,
    ),
  );

  return {
    delegationsCount: activeStakesCount,
    delegatedTotal: divideBy1e18(totalStakedTokens),
    undelegatedTotal: divideBy1e18(totalUnstakedTokens),
    totalRewards: realizedRewards + unrealizedRewards,
    realizedRewards,
    lastDelegation: lastDelegation?.lastDelegatedAt ? formatTableDate(lastDelegation.lastDelegatedAt) : null,
    unrealizedRewards,
    lastUndelegation: lastUndelegation?.lastUndelegatedAt
      ? formatTableDate(lastUndelegation.lastUndelegatedAt)
      : null,
  };
};
