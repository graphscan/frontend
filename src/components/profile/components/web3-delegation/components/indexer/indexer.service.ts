import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { IndexerData, transform } from './indexer.model';
import { INDEXER_DELEGATION_DATA_CACHE_KEY } from '../../web3-delegation.service';
import { useGraphNetwork } from '../../../../../../services/graph-network.service';
import { request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';

export type IndexerDataResponse = {
  indexer: IndexerData;
};

export const useIndexerDelegationData = (id: string) => {
  const { data: graphNetwork, isLoading: isGNLoading } = useGraphNetwork();

  const { data, isLoading } = useQuery([INDEXER_DELEGATION_DATA_CACHE_KEY, id.toLowerCase()], async () => {
    const { indexer } = await request<IndexerDataResponse>(gql`
      query {
        indexer(id: ${JSON.stringify(id.toLowerCase())}) {
          id
          indexingRewardEffectiveCut
          queryFeeEffectiveCut
          delegatedTokens
          stakedTokens
          lockedTokens
          allocatedTokens
          indexingRewardCut
          allocations(first: ${REQUEST_LIMIT}) {
            id
            allocatedTokens
            subgraphDeployment {
              id
              signalledTokens
              stakedTokens
              deniedAt
            }
          }
        }
      }
    `);

    return indexer;
  });

  return {
    data: graphNetwork && data ? transform({ indexerData: data, networkData: graphNetwork }) : undefined,
    isLoading: isLoading || isGNLoading,
  };
};

export type IndexerDelegationResponse = ReturnType<typeof useIndexerDelegationData>;
