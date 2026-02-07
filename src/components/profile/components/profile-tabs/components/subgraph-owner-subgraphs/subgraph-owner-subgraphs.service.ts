import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import {
  SubgraphOwnerSubgraph,
  transformToRows,
} from "./subgraph-owner-subgraphs.model";
import {
  fetchAllConsecutively,
  request,
  REQUEST_LIMIT,
} from "../../../../../../services/graphql.service";
import { useGraphNetwork } from "../../../../../../services/graph-network.service";

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

export const createSubgraphOwnerSubgraphsFetcher =
  (id: string) => async (skip: number) => {
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
  const { data: networkData } = useGraphNetwork();

  return useQuery(
    ["subgraph-owner-subgraphs", id],
    async () => {
      if (!networkData) {
        return Promise.reject(
          new Error(
            "Subgraph Owner Subgraphs request cannot be sent without network data.",
          ),
        );
      }

      const { totalTokensAllocated, totalTokensSignalled } = networkData;

      const subgraphs = await fetchAllConsecutively(
        createSubgraphOwnerSubgraphsFetcher(id),
      );

      return transformToRows({
        subgraphs,
        totalTokensAllocated,
        totalTokensSignalled,
      });
    },
    { enabled: Boolean(networkData) },
  );
};
