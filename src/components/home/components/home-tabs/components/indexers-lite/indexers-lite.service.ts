import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { IndexerLite, IndexersTransformerConfigLite, transformToRows } from './indexers-lite.model';
import { useGraphNetwork } from '../../../../../../services/graph-network.service';
import { fetchAllParallel, request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';

type IndexersResponseLite = {
  indexers: Array<IndexerLite>;
};

const getIndexers = async (skip: number) => {
  const { indexers } = await request<IndexersResponseLite>(
    gql`
      query {
        indexers(
          first: ${REQUEST_LIMIT},
          skip: ${skip}
        ) {
          id
          defaultDisplayName
          indexingRewardEffectiveCut
          indexingRewardCut
          queryFeeEffectiveCut
          queryFeeCut
          stakedTokens
          lockedTokens
          delegatedTokens
          allocatedTokens
          allocations(
            first: ${REQUEST_LIMIT},
            where: { allocatedTokens_not: "0" }
          ) {
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
    `,
  );

  return indexers;
};

const useIndexersData = () => {
  const { data: networkData } = useGraphNetwork();

  return useQuery(
    ['indexers'],
    async () => {
      if (!networkData) {
        return Promise.reject(new Error('Indexers request cannot be sent without network data.'));
      }

      const indexers = await fetchAllParallel(networkData.indexerCount, getIndexers);

      return {
        indexers,
        networkData,
      };
    },
    { enabled: Boolean(networkData) },
  );
};

export const useIndexers = ({
  plannedDelegation,
  plannedIndexerCut,
  favourites,
}: IndexersTransformerConfigLite) => {
  const { data, error, isLoading, isRefetching } = useIndexersData();

  return {
    data: data
      ? transformToRows({
          plannedDelegation,
          plannedIndexerCut,
          favourites,
          ...data,
        })
      : [],
    error,
    isLoading,
    isRefetching,
  };
};
