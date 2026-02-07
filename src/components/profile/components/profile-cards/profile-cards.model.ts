import { DelegatedStake } from "../../../../model/delegators.model";
import { formatProfileCardDate } from "../../../../utils/cards.utils";
import {
  calcCurrentDelegation,
  calcUnrealizedRewardsLegacy,
} from "../../../../utils/delegators.utils";
import { divideBy1e18 } from "../../../../utils/number.utils";

export type GraphAccount = {
  id: string;
  balance: string;
  createdAt: number;
  defaultDisplayName: string | null;
  delegator: {
    id: string;
    stakes: Array<DelegatedStake & { lockedTokens: string }>;
  } | null;
  indexer: {
    id: string;
    idOnL2: string | null;
    stakedTokens: string;
  } | null;
  curator: {
    id: string;
    allCurrentGRTValue: string;
    totalSignalledTokens: string;
    totalUnsignalledTokens: string;
  } | null;
};

export type TokenLockWallet = {
  id: string;
  beneficiary: string;
};

export const transformAccount = ({
  graphAccount,
  tokenLockWallets,
  beneficiaryFromContract,
}: {
  graphAccount: GraphAccount | null;
  tokenLockWallets: TokenLockWallet | Array<TokenLockWallet>;
  beneficiaryFromContract?: string;
}) => {
  return {
    account: {
      indexerId: graphAccount?.indexer?.id ?? null,
      idOnL2: graphAccount?.indexer?.idOnL2 ?? null,
      name: graphAccount?.defaultDisplayName ?? "",
      createdAt: graphAccount?.createdAt
        ? formatProfileCardDate(graphAccount.createdAt)
        : null,
      tokenLockWalletsIds: Array.isArray(tokenLockWallets)
        ? tokenLockWallets.map(({ id }) => id)
        : tokenLockWallets.beneficiary,
      isIndexer: Boolean(graphAccount?.indexer),
      isDelegator: Boolean(graphAccount?.delegator),
      beneficiaryFromContract,
    },
    wallet: {
      indexerStaked: graphAccount?.indexer
        ? divideBy1e18(graphAccount.indexer.stakedTokens)
        : 0,
      delegation: graphAccount?.delegator
        ? divideBy1e18(
            graphAccount.delegator.stakes.reduce(
              (acc, val) => acc + Number(val.lockedTokens),
              0,
            ) + calcCurrentDelegation(graphAccount.delegator.stakes),
          )
        : 0,
      delegationDelta: graphAccount?.delegator
        ? divideBy1e18(
            calcUnrealizedRewardsLegacy(graphAccount.delegator.stakes),
          )
        : null,
      curation: graphAccount?.curator
        ? divideBy1e18(graphAccount.curator.allCurrentGRTValue)
        : 0,
      curationDelta: graphAccount?.curator
        ? divideBy1e18(
            Number(graphAccount.curator.totalUnsignalledTokens) +
              Number(graphAccount.curator.allCurrentGRTValue) -
              Number(graphAccount.curator.totalSignalledTokens),
          )
        : null,
      balance: graphAccount ? divideBy1e18(graphAccount.balance) : 0,
    },
  };
};
