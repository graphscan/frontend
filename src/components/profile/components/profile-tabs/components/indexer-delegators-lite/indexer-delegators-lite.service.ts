import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { IndexerDelegatorLite, transformToRow } from './indexer-delegators-lite.model';
import { INDEXER_DELEGATORS_CACHE_KEY } from '../../../../../../services/indexer-delegators.service';
import { fetchAllConsecutively, request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';

type IndexerDelegatorsResponseLite = {
  delegatedStakes: Array<IndexerDelegatorLite>;
};

const createIndexerDelegatorsFetcher = (id: string) => async (skip: number) => {
  const { delegatedStakes } = await request<IndexerDelegatorsResponseLite>(
    gql`
      query {
        delegatedStakes(
          first: ${REQUEST_LIMIT}
          skip: ${skip}
          where: { indexer: ${JSON.stringify(id.toLowerCase())}}
        ) {
          id
          delegator {
            id
          }
          indexer {
            id
            delegatorShares
            delegatedTokens
            delegationExchangeRate
          }
          stakedTokens
          shareAmount
          unstakedTokens
          personalExchangeRate
          realizedRewards
          createdAt
          lastUndelegatedAt
        }
      }
    `,
  );

  return delegatedStakes;
};

export const useIndexerDelegators = (id: string) =>
  useQuery([INDEXER_DELEGATORS_CACHE_KEY, id.toLowerCase()], async () => {
    const indexerDelegators = await fetchAllConsecutively(createIndexerDelegatorsFetcher(id));

    return indexerDelegators.map(transformToRow);
  });
