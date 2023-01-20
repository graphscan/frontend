import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { GraphAccountLite, TokenLockWallet, transformAccount } from './profile-cards-lite.model';
import { request, REQUEST_LIMIT } from '../../../../services/graphql.service';

type AccountResponseLite = {
  graphAccount: GraphAccountLite | null;
  tokenLockWallet: TokenLockWallet | null;
  tokenLockWallets: Array<TokenLockWallet>;
};

export const useAccount = (id: string) => {
  return useQuery(['account', id], async () => {
    const { graphAccount, tokenLockWallet, tokenLockWallets } = await request<AccountResponseLite>(
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
            }
            delegator {
              id
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
