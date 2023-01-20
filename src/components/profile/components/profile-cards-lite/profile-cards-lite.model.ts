import { formatCardDate } from '../../../../utils/cards.utils';
import { divideBy1e18 } from '../../../../utils/number.utils';

export type GraphAccountLite = {
  id: string;
  balance: string;
  createdAt: number;
  defaultDisplayName: string | null;
  delegator: { id: string } | null;
  curator: { id: string } | null;
  indexer: { id: string; stakedTokens: string } | null;
};

export type TokenLockWallet = {
  id: string;
  beneficiary: string;
};

export const transformAccount = ({
  graphAccount,
  tokenLockWallets,
}: {
  graphAccount: GraphAccountLite | null;
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
      delegation: 0,
      delegationDelta: null,
      curation: 0,
      curationDelta: null,
      balance: graphAccount ? divideBy1e18(graphAccount.balance) : 0,
    },
    showWallet: !(graphAccount?.delegator || graphAccount?.curator),
  };
};
