import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { request, REQUEST_LIMIT } from "../../../services/graphql.service";

type TokenLockWalletsResponse = {
  tokenLockWallets: Array<{ id: string }>;
};

export const useLockWallets = (id: string | undefined) => {
  return useQuery(
    ["lock-wallets", id],
    async () => {
      const { tokenLockWallets } = await request<TokenLockWalletsResponse>(gql`
      query {
        tokenLockWallets(
          first:${REQUEST_LIMIT}
          where:{ beneficiary: ${JSON.stringify(id)} }
        ){
          id
        }
      }
    `);

      return tokenLockWallets.map(({ id }) => id);
    },
    { enabled: typeof id === "string" },
  );
};
