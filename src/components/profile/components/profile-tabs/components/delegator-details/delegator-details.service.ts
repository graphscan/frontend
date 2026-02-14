import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import {
  DelegatorDetails,
  transformDelegatorDetails,
} from "./delegator-details.model";
import {
  REQUEST_LIMIT,
  request,
} from "../../../../../../services/graphql.service";

type DelegatorDetailsResponse = {
  delegator: DelegatorDetails;
};

export const useDelegatorDetails = (id: string) => {
  return useQuery(["delegator-details", id], async () => {
    const { delegator } = await request<DelegatorDetailsResponse>(
      gql`
        query {
          delegator(id: ${JSON.stringify(id.toLowerCase())}) {
            id
            activeStakesCount
            totalStakedTokens
            totalUnstakedTokens
            stakes(
              first: ${REQUEST_LIMIT}
            ) {
              id
              shareAmount
              personalExchangeRate
              stakedTokens
              unstakedTokens
              lastDelegatedAt
              lastUndelegatedAt
              indexer {
                id
                delegatedTokens
                delegatorShares
                delegatedThawingTokens
              }
            }
          }
        }
      `,
    );

    return transformDelegatorDetails(delegator);
  });
};
