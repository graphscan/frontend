import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { IndexerDetails, transform } from './indexer-details.model';
import { request } from '../../../../../../services/graphql.service';

type IndexerDetailsResponse = {
  indexer: IndexerDetails;
};

export const useIndexerDetails = (id: string) => {
  return useQuery(['indexer-details', id], async () => {
    const { indexer } = await request<IndexerDetailsResponse>(
      gql`
        query {
          indexer(id: ${JSON.stringify(id.toLowerCase())}) {
            id
            indexingRewardEffectiveCut
            indexingRewardCut
            queryFeeEffectiveCut
            queryFeeCut
            allocatedTokens
            delegatedTokens
            stakedTokens
            lockedTokens
            delegatorIndexingRewards
            delegatorQueryFees
            indexerIndexingRewards
            indexerQueryFees
            geoHash
          }
        }
      `,
    );

    return transform(indexer);
  });
};
