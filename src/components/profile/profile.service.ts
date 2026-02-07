import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { request } from "../../services/graphql.service";

type AccountTypeResponse = {
  graphAccount: {
    id: string;
    delegator: { id: string } | null;
    curator: { id: string } | null;
    indexer: { id: string } | null;
    subgraphs: Array<{ id: string }>;
  } | null;
};

export const useAccountType = (id: string) => {
  return useQuery(["account-type", id], async () => {
    const { graphAccount } = await request<AccountTypeResponse>(
      gql`
        query {
          graphAccount(id: ${JSON.stringify(id.toLowerCase())}) {
            id
            delegator {
              id
            }
            curator {
              id
            }
            indexer {
              id
            }
            subgraphs(first: 1) {
              id
            }
          }
        }
      `,
    );

    return graphAccount
      ? {
          isDelegator: Boolean(graphAccount.delegator),
          isCurator: Boolean(graphAccount.curator),
          isIndexer: Boolean(graphAccount.indexer),
          isSubgraphOwner: graphAccount.subgraphs.length > 0,
        }
      : null;
  });
};
