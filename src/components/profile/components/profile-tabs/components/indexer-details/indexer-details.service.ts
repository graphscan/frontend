import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { IndexerDetails, transform } from "./indexer-details.model";
import {
  request,
  REQUEST_LIMIT,
} from "../../../../../../services/graphql.service";
import {
  capacityProvisionFragment,
  fetchCapacityProvisions,
} from "../../../../../../services/indexer-capacity.service";
import { CURRENT_DATA_QUERY_OPTIONS } from "../../../../../../services/query-policy";

type IndexerDetailsResponse = {
  indexer: IndexerDetails;
  _meta: { block: { number: number } };
};

export const useIndexerDetails = (id: string) => {
  return useQuery(
    ["indexer-details", id],
    async () => {
      const { indexer, _meta } = await request<IndexerDetailsResponse>(
        gql`
        ${capacityProvisionFragment}
        query {
          _meta { block { number } }
          indexer(id: ${JSON.stringify(id.toLowerCase())}) {
            id
            indexingRewardCut
            queryFeeCut
            ownStakeRatio
            allocatedTokens
            legacyAllocatedTokens
            provisions(first: ${REQUEST_LIMIT}, orderBy: id, orderDirection: asc) {
              ...CapacityProvisionFragment
            }
            delegatedTokens
            delegatedThawingTokens
            stakedTokens
            lockedTokens
            delegatorIndexingRewards
            delegatorQueryFees
            indexerIndexingRewards
            queryFeesCollected
            queryFeeRebates
            geoHash
          }
        }
      `,
      );

      return transform({
        ...indexer,
        provisions: await fetchCapacityProvisions(
          indexer.id,
          indexer.provisions,
          _meta.block.number,
        ),
      });
    },
    CURRENT_DATA_QUERY_OPTIONS,
  );
};
