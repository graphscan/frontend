import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { GraphNetwork } from '../../../../model/graph-network.model';
import { useGraphNetwork } from '../../../../services/graph-network.service';
import { fetchAllParallel, request, REQUEST_LIMIT } from '../../../../services/graphql.service';

type ActualSubgraphsResponse = {
  subgraphs: Array<{ id: string }>;
};

export const getActualSubgraphs = async (skip: number) => {
  const { subgraphs } = await request<ActualSubgraphsResponse>(
    gql`
      query {
        subgraphs(
          first: ${REQUEST_LIMIT},
          skip: ${skip}, 
          where: {currentVersion_not: null, entityVersion: 2
          },
        ) {
          id
        }
      }
    `,
  );

  return subgraphs;
};

export const useNetworkStats = () => {
  const { data: networkData } = useGraphNetwork();

  return useQuery<GraphNetwork>(
    ['network-stats'],
    async () => {
      if (!networkData) {
        return Promise.reject(new Error('Network stats request cannot be sent without network data.'));
      }

      const subgraphs = await fetchAllParallel(networkData.subgraphCount, getActualSubgraphs);

      return {
        ...networkData,
        subgraphCount: subgraphs.length,
      };
    },
    { enabled: Boolean(networkData) },
  );
};
