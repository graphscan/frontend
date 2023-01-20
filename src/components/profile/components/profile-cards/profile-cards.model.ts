import { formatCardDate } from '../../../../utils/cards.utils';
import { divideBy1e18 } from '../../../../utils/number.utils';

export type GraphAccount = {
  id: string;
  balance: string;
  createdAt: number;
  defaultDisplayName: string | null;
  delegator: {
    id: string;
    currentStaked: string;
    unreleasedReward: string;
    stakes: Array<{ id: string; lockedTokens: string }>;
  } | null;
  indexer: { id: string; stakedTokens: string } | null;
  curator: { id: string; allCurrentGRTValue: string; unrealizedPLGrt: string } | null;
};

export type TokenLockWallet = {
  id: string;
  beneficiary: string;
};

export const transformAccount = ({
  graphAccount,
  tokenLockWallets,
}: {
  graphAccount: GraphAccount | null;
  tokenLockWallets: TokenLockWallet | Array<TokenLockWallet>;
}) => {
  return {
    account: {
      indexerId: graphAccount?.indexer?.id ?? null,
      name: graphAccount?.defaultDisplayName ?? '',
      createdAt: graphAccount?.createdAt ? formatCardDate(graphAccount.createdAt) : null,
      tokenLockWalletsIds: Array.isArray(tokenLockWallets)
        ? tokenLockWallets.map(({ id }) => id)
        : tokenLockWallets.beneficiary,
    },
    wallet: {
      indexerStaked: graphAccount?.indexer ? divideBy1e18(graphAccount.indexer.stakedTokens) : 0,
      delegation: graphAccount?.delegator
        ? divideBy1e18(
            graphAccount.delegator.stakes.reduce((acc, val) => acc + Number(val.lockedTokens), 0) +
              Number(graphAccount.delegator.currentStaked),
          )
        : 0,
      delegationDelta: graphAccount?.delegator ? divideBy1e18(graphAccount.delegator.unreleasedReward) : null,
      curation: graphAccount?.curator ? divideBy1e18(graphAccount.curator.allCurrentGRTValue) : 0,
      curationDelta: graphAccount?.curator ? divideBy1e18(graphAccount.curator.unrealizedPLGrt) : null,
      balance: graphAccount ? divideBy1e18(graphAccount.balance) : 0,
    },
  };
};
