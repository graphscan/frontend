import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { DelegatorDetails, transformDelegatorDetails } from './delegator-details.model';
import { request } from '../../../../../../services/graphql.service';

type DelegatorDetailsResponse = {
  delegator: DelegatorDetails;
};

export const useDelegatorDetails = (id: string) => {
  return useQuery(['delegator-details', id], async () => {
    const { delegator } = await request<DelegatorDetailsResponse>(
      gql`
        query {
          delegator(id: ${JSON.stringify(id.toLowerCase())}) {
            id
            activeStakesCount
            currentStaked
            totalStakedTokens
            totalUnstakedTokens
            totalRewards
            totalRealizedRewards
            unreleasedReward
            lastDelegatedAt
            lastUndelegatedAt
          }
        }
      `,
    );

    return transformDelegatorDetails(delegator);
  });
};
