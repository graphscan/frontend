import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { DelegatedStakeLite, DelegatorLite, transformDelegatorDetails } from './delegator-details-lite.model';
import { fetchAllConsecutively, request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';

type DelegatorResponseLite = {
  delegator: DelegatorLite;
};

export type DelegatedStakesResponseLite = {
  delegatedStakes: Array<DelegatedStakeLite>;
};

export const createDelegatedStakesFetcher = (delegatorId: string) => async (skip: number) => {
  const { delegatedStakes } = await request<DelegatedStakesResponseLite>(
    gql`
      query {
        delegatedStakes(
          first: ${REQUEST_LIMIT},
          skip: ${skip},
          where: { delegator: ${JSON.stringify(delegatorId.toLowerCase())}}
        ) {
          id
          personalExchangeRate
          shareAmount
          indexer {
            delegationExchangeRate
          }
        }
      }
    `,
  );

  return delegatedStakes;
};

export const useDelegatorDetails = (id: string) => {
  return useQuery(['delegator-details', id], async () => {
    const [{ delegator }, delegatedStakes] = await Promise.all([
      request<DelegatorResponseLite>(
        gql`
          query {
            delegator(id: ${JSON.stringify(id.toLowerCase())}) {
              id
              activeStakesCount
              totalStakedTokens
              totalUnstakedTokens
              totalRealizedRewards
              lastDelegationAt: stakes(
                first: 1, 
                where: {lastDelegatedAt_not: null}, 
                orderBy: lastDelegatedAt, 
                orderDirection: desc
              ) {
                id
                lastDelegatedAt
              }
              lastUnDelegationAt: stakes(
                first: 1, 
                where: {lastUndelegatedAt_not: null}, 
                orderBy: lastUndelegatedAt, 
                orderDirection: desc
              ) {
                id
                lastUndelegatedAt
              }
            }
          }
        `,
      ),
      fetchAllConsecutively(createDelegatedStakesFetcher(id)),
    ]);

    return transformDelegatorDetails({ ...delegator, delegatedStakes });
  });
};
