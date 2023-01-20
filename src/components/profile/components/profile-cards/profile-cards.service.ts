import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { GraphAccount, TokenLockWallet, transformAccount } from './profile-cards.model';
import { request, REQUEST_LIMIT } from '../../../../services/graphql.service';

type AccountResponse = {
  graphAccount: GraphAccount | null;
  tokenLockWallet: TokenLockWallet | null;
  tokenLockWallets: Array<TokenLockWallet>;
};

export const useAccount = (id: string) => {
  return useQuery(['account', id], async () => {
    const { graphAccount, tokenLockWallet, tokenLockWallets } = await request<AccountResponse>(
      gql`
        query {
          graphAccount(id: ${JSON.stringify(id.toLowerCase())}) {
            id
            balance
            createdAt
            defaultDisplayName
            indexer {
              id
              stakedTokens
            }
            curator {
              id
              allCurrentGRTValue
              unrealizedPLGrt
            }
            delegator {
              id
              currentStaked
              unreleasedReward
              stakes(
                first: ${REQUEST_LIMIT}
                where: {lockedTokens_not: "0"}
              ) {
                id
                lockedTokens
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

    return transformAccount({
      graphAccount,
      tokenLockWallets: tokenLockWallet ?? tokenLockWallets,
    });
  });
};
