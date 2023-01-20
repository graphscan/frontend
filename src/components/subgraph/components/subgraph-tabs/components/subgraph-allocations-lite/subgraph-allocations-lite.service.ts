import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { SubgraphAllocationLite } from './subgraph-allocations-lite.model';
import { fetchAllConsecutively, request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';

type SubgraphAllocationsResponse = {
  subgraphVersion: {
    subgraphDeployment: {
      indexerAllocations: Array<SubgraphAllocationLite>;
    };
  };
};

const createSubgraphAllocationsFetcher = (id: string) => async (skip: number) => {
  const { subgraphVersion } = await request<SubgraphAllocationsResponse>(gql`
    query {
      subgraphVersion(id: ${JSON.stringify(id.startsWith('0x') ? id.toLowerCase() : id)}) {
        id
        subgraphDeployment {
          id
          indexerAllocations(
            first: ${REQUEST_LIMIT},
            skip: ${skip},
          ) {
            id
            indexer {
              id
              defaultDisplayName
              indexingRewardCut
              indexingRewardEffectiveCut
            }
            status
            allocatedTokens
            createdAt
            createdAtEpoch
            closedAt
            closedAtEpoch
            indexingRewardCutAtClose
            indexingRewardEffectiveCutAtClose
            indexingIndexerRewards
            indexingDelegatorRewards
            poi
          }
        }
      }
    }
  `);

  return subgraphVersion.subgraphDeployment.indexerAllocations;
};

export const useSubgraphAllocations = (id: string) =>
  useQuery(['subgraph-allocations', id], async () => {
    const allocations = await fetchAllConsecutively(createSubgraphAllocationsFetcher(id));

    return allocations;
  });
