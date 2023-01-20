import { formatTableDate } from '../../../../../../utils/table.utils';
import { divideBy1e18 } from '../../../../../../utils/number.utils';

export type DelegatorDetails = {
  id: string;
  activeStakesCount: number;
  currentStaked: string;
  totalStakedTokens: string;
  totalUnstakedTokens: string;
  totalRewards: string;
  totalRealizedRewards: string;
  unreleasedReward: string;
  lastDelegatedAt: number | null;
  lastUndelegatedAt: number | null;
  realizedRewards: string;
};

export const transformDelegatorDetails = ({
  activeStakesCount,
  currentStaked,
  totalStakedTokens,
  totalUnstakedTokens,
  totalRewards,
  totalRealizedRewards,
  unreleasedReward,
  lastDelegatedAt,
  lastUndelegatedAt,
}: DelegatorDetails) => {
  const currentDelegations = divideBy1e18(currentStaked);

  return {
    delegationsCount: activeStakesCount,
    currentDelegations,
    delegatedTotal: divideBy1e18(totalStakedTokens),
    undelegatedTotal: divideBy1e18(totalUnstakedTokens),
    totalRewards: divideBy1e18(totalRewards),
    realizedRewards: divideBy1e18(totalRealizedRewards),
    unrealizedRewards: divideBy1e18(unreleasedReward),
    unrealizedPercent: currentDelegations === 0 ? 0 : Number(unreleasedReward) / Number(currentStaked),
    lastDelegation: lastDelegatedAt ? formatTableDate(lastDelegatedAt) : null,
    lastUndelegation: lastUndelegatedAt ? formatTableDate(lastUndelegatedAt) : null,
  };
};
