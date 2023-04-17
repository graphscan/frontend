import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { SubgraphOwnerSubgraph, transformToRow } from './subgraph-owner-subgraphs.model';
import { fetchAllConsecutively, request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';

const versionFragment = gql`
  fragment SubgraphOwnerSubgraphsVersionFragment on SubgraphVersion {
    id
    createdAt
    subgraphDeployment {
      id
      signalledTokens
      stakedTokens
      indexingRewardAmount
      queryFeesAmount
      deniedAt
      versions(first: ${REQUEST_LIMIT}, where: {entityVersion: 2}) {
        id
        subgraph {
          id
          currentVersion {
            id
          }
        }
        subgraphDeployment {
          id
        }
      }
    }
  }
`;

type SubgraphOwnerSubgraphsResponse = {
  graphAccount: {
    id: string;
    subgraphs: Array<SubgraphOwnerSubgraph>;
  };
};

export const createSubgraphOwnerSubgraphsFetcher = (id: string) => async (skip: number) => {
  const {
    graphAccount: { subgraphs },
  } = await request<SubgraphOwnerSubgraphsResponse>(gql`
    ${versionFragment}
    query {
      graphAccount(id: ${JSON.stringify(id.toLowerCase())}) {
        id
        subgraphs(
          first: ${REQUEST_LIMIT},
          skip: ${skip},
          where: {entityVersion: 2}) {
          id
          active
          metadata {
            image
            displayName
          }
          currentVersion {
            ...SubgraphOwnerSubgraphsVersionFragment
          }
          versions(first: ${REQUEST_LIMIT}, where: {entityVersion: 2}) {
            ...SubgraphOwnerSubgraphsVersionFragment
          }
        }
      }
    }
  `);

  return subgraphs;
};

export const useSubgraphOwnerSubgraphs = (id: string) => {
  return useQuery(['subgraph-owner-subgraphs', id], async () => {
    const subgraphs = await fetchAllConsecutively(createSubgraphOwnerSubgraphsFetcher(id));

    return subgraphs.map(transformToRow);
  });
};
