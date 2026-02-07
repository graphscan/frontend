import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { fetchAllConsecutively, request, REQUEST_LIMIT } from '../../../../services/graphql.service';
import { divideBy1e18 } from '../../../../utils/number.utils';

export const INDEXER_DELEGATION_DATA_CACHE_KEY = 'indexer-delegation-data';

type DelegationsResponse = {
  delegatedStakes: Array<{
    id: string;
    shareAmount: string;
    indexer: {
      id: string;
      delegatedTokens: string;
      delegatorShares: string;
    };
  }>;
};

const createDelegationsFetcher = (id: string) => async (skip: number) => {
  const { delegatedStakes } = await request<DelegationsResponse>(gql`
    query {
      delegatedStakes(
        first: ${REQUEST_LIMIT}
        skip: ${skip}
        where: { delegator: ${JSON.stringify(id.toLowerCase())} }
      ) {
        id
        shareAmount
        indexer {
          id
          delegatedTokens
          delegatorShares
        }
      }
    }
  `);

  return delegatedStakes;
};

export const useDelegations = (id: string | undefined, indexerId: string) => {
  return useQuery(
    ['delegations', id, indexerId],
    async () => {
      if (typeof id === 'string') {
        const delegations = (await fetchAllConsecutively(createDelegationsFetcher(id))).map(
          ({ indexer: { id, delegatedTokens, delegatorShares }, shareAmount }) => {
            const shares = Number(delegatorShares);

            return {
              id,
              currentDelegation: divideBy1e18(
                shares > 0 ? (Number(shareAmount) * Number(delegatedTokens)) / shares : 0,
              ),
            };
          },
        );

        const delegatedToCurrentIndexer = delegations.find(({ id }) => id === indexerId)?.currentDelegation;
        const delegatedTotal = delegations.reduce((acc, { currentDelegation }) => acc + currentDelegation, 0);

        return {
          delegatedTotal,
          delegatedToCurrentIndexer,
        };
      }
    },
    { enabled: typeof id === 'string' },
  );
};
