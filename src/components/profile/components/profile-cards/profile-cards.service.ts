import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { ethers } from "ethers";
import {
  GraphAccount,
  TokenLockWallet,
  transformAccount,
} from "./profile-cards.model";
import L2GraphTokenLockWallet from "../model/L2GraphTokenLockWallet.json";
import { request, REQUEST_LIMIT } from "../../../../services/graphql.service";
import { getEnsName } from "../../../../services/ens.service";
import { web3Client } from "../../../../services/web3.service";

type AccountResponse = {
  graphAccount: GraphAccount | null;
  tokenLockWallet: TokenLockWallet | null;
  tokenLockWallets: Array<TokenLockWallet>;
};

export const useAccount = (id: string) => {
  return useQuery(["account", id], async () => {
    const { graphAccount, tokenLockWallet, tokenLockWallets } =
      await request<AccountResponse>(
        gql`
        query {
          graphAccount(id: ${JSON.stringify(id.toLowerCase())}) {
            id
            balance
            createdAt
            defaultDisplayName
            indexer {
              id
              idOnL2
              stakedTokens
            }
            curator {
              id
              allCurrentGRTValue: totalSignalAverageCostBasis
              totalSignalledTokens: totalSignalledTokens
              totalUnsignalledTokens: totalUnsignalledTokens
            }
            delegator {
              id
              stakes(
                first: ${REQUEST_LIMIT}
              ) {
                id
                lockedTokens
                shareAmount
                stakedTokens
                unstakedTokens
                realizedRewards
                indexer {
                  id
                  delegatedTokens
                  delegatorShares
                  delegatedThawingTokens
                }
              }
            }
          }
          tokenLockWallet(id: ${JSON.stringify(id.toLowerCase())}) {
            id
            beneficiary
          }
          tokenLockWallets(
            first: ${REQUEST_LIMIT}
            where:{ beneficiary: ${JSON.stringify(id.toLowerCase())} }
          ) {
            id
            beneficiary
          }
        }
      `,
      );

    if (graphAccount && !graphAccount.defaultDisplayName) {
      try {
        const name = await getEnsName(graphAccount.id);

        if (name) {
          graphAccount.defaultDisplayName = name;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }

    let beneficiaryFromContract: string | undefined = undefined;

    if (!tokenLockWallet && tokenLockWallets.length === 0) {
      try {
        const lockContract = new ethers.Contract(
          id,
          L2GraphTokenLockWallet,
          web3Client,
        );

        beneficiaryFromContract = await lockContract.beneficiary();
        // eslint-disable-next-line no-empty
      } catch {}
    }

    return transformAccount({
      graphAccount,
      tokenLockWallets: tokenLockWallet ?? tokenLockWallets,
      beneficiaryFromContract,
    });
  });
};
