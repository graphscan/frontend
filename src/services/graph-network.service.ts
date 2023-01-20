import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { GraphNetwork } from '../model/graph-network.model';
import { request } from './graphql.service';

type GraphNetworkResponse = {
  graphNetwork: GraphNetwork;
};

export const useGraphNetwork = () =>
  useQuery(['graph-network'], async () => {
    const { graphNetwork } = await request<GraphNetworkResponse>(
      gql`
        query {
          graphNetwork(id: 1) {
            id
            indexerCount
            delegatorCount
            curatorCount
            subgraphCount
            totalGRTMinted
            totalSupply
            totalGRTBurned
            totalTokensStaked
            totalDelegatedTokens
            totalTokensAllocated
            totalTokensClaimable
            totalQueryFees
            totalIndexingRewards
            totalIndexingDelegatorRewards
            totalIndexingIndexerRewards
            currentEpoch
            totalTokensSignalled
            networkGRTIssuance
            arbitrator
            controller
            curation
            gns
            governor
            graphToken
            rewardsManager
            serviceRegistry
            staking
            epochManager
          }
        }
      `,
    );

    return graphNetwork;
  });
