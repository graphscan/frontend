import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { prop, uniqBy } from "ramda";
import { Account } from "./account-search.model";
import { request } from "../../../../../services/graphql.service";
import { isTermLongEnough } from "../../../../../utils/account-search.utils";
import { useDebounce } from "../../../../../utils/debounce.utils";

type AccountSearchResponse = {
  accountSearch: Array<Account>;
};

const getAccounts = async (searchTerm: string) => {
  const { accountSearch } = await request<AccountSearchResponse>(gql`
    query {
      accountSearch(
        text: "${searchTerm}:* | 0x${searchTerm}:*",
        first: 10
      ) {
        id
        defaultDisplayName
        tokenLockWallets {
          id
        }
      }
    }
  `);

  return accountSearch;
};

type AccountSearchResponseLite = Record<
  "accounts" | "indexers" | "delegators" | "curators",
  Array<Account>
>;

const getAccountsLite = async (searchTerm: string, first = 5) => {
  const { accounts, indexers, delegators, curators } =
    await request<AccountSearchResponseLite>(gql`
    query {
      accounts: graphAccounts(
        first: 10
        where: {defaultDisplayName_contains: ${JSON.stringify(searchTerm)}}
      ) {
        id
        defaultDisplayName
        tokenLockWallets {
          id
        }
      }

      indexers: graphAccounts(
        first: ${first},
        where: {indexer_starts_with: ${JSON.stringify(
          searchTerm.startsWith("0x") ? searchTerm : `0x${searchTerm}`,
        )}}
      ) {
        id
        defaultDisplayName
        tokenLockWallets {
          id
        }
      }

      delegators: graphAccounts(
        first: ${first},
        where: {delegator_starts_with: ${JSON.stringify(
          searchTerm.startsWith("0x") ? searchTerm : `0x${searchTerm}`,
        )}}
      ) {
        id
        defaultDisplayName
        tokenLockWallets {
          id
        }
      }

      curators: graphAccounts(
        first: ${first},
        where: {curator_starts_with: ${JSON.stringify(
          searchTerm.startsWith("0x") ? searchTerm : `0x${searchTerm}`,
        )}}
      ) {
        id
        defaultDisplayName
        tokenLockWallets {
          id
        }
      }
    }
  `);

  return uniqBy(prop("id"), [
    ...accounts,
    ...indexers,
    ...delegators,
    ...curators,
  ]);
};
// use main subgraph search string by defaul
export const useAccountsSearch = (
  searchTerm: string,
  useSearchByEntity: boolean = true,
) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return useQuery(
    ["accounts-search", debouncedSearchTerm],
    async () => {
      const accounts = await (useSearchByEntity
        ? getAccountsLite(debouncedSearchTerm)
        : getAccounts(debouncedSearchTerm));

      return accounts;
    },
    { enabled: isTermLongEnough(debouncedSearchTerm) },
  );
};
