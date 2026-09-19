import { gql } from "graphql-request";
import { IndexerProvision } from "../utils/indexer-capacity.utils";
import {
  fetchAllConsecutively,
  request,
  REQUEST_LIMIT,
} from "./graphql.service";

export const capacityProvisionFragment = gql`
  fragment CapacityProvisionFragment on Provision {
    id
    tokensProvisioned
    tokensThawing
    tokensAllocated
    delegatedTokens
    delegatedThawingTokens
    dataService {
      delegationRatio
    }
  }
`;

export const fetchCapacityProvisions = async (
  id: string,
  provisions: IndexerProvision[],
  blockNumber: number,
) => {
  if (provisions.length < REQUEST_LIMIT) return provisions;
  return fetchAllConsecutively(async (skip) => {
    const { indexer } = await request<{
      indexer: { provisions: IndexerProvision[] };
    }>(gql`
      ${capacityProvisionFragment}
      query {
        indexer(id: ${JSON.stringify(id)}, block: { number: ${blockNumber} }) {
          provisions(first: ${REQUEST_LIMIT}, skip: ${skip}, orderBy: id, orderDirection: asc) {
            ...CapacityProvisionFragment
          }
        }
      }
    `);
    return indexer.provisions;
  }, provisions);
};
