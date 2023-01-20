import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { IndexerDetailsLite, transform } from './indexer-details-lite.model';
import { request } from '../../../../../../services/graphql.service';

type IndexerDetailsResponseLite = {
  indexer: IndexerDetailsLite;
};

export const useIndexerDetails = (id: string) => {
  return useQuery(['indexer-details', id], async () => {
    const { indexer } = await request<IndexerDetailsResponseLite>(
      gql`
        query {
          indexer(id: ${JSON.stringify(id.toLowerCase())}) {
            id
            indexingRewardEffectiveCut
            indexingRewardCut
            queryFeeEffectiveCut
            queryFeesCollected
            queryFeeCut
            queryFeeRebates
            allocatedTokens
            delegatedTokens
            stakedTokens
            lockedTokens
            delegatorIndexingRewards
            delegatorQueryFees
            indexerIndexingRewards
            geoHash
          }
        }
      `,
    );

    return transform(indexer);
  });
};
