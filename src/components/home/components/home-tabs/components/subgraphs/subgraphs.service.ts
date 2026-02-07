import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { Subgraph, SubgraphsData } from "./subgraphs.model";
import { useGraphNetwork } from "../../../../../../services/graph-network.service";
import {
  fetchAllParallel,
  request,
  REQUEST_LIMIT,
} from "../../../../../../services/graphql.service";

type SubgraphsResponse = {
  subgraphs: Array<Subgraph>;
};

const fetchSubgraphs = async (skip: number) => {
  const { subgraphs } = await request<SubgraphsResponse>(
    gql`
      query {
        subgraphs(
          first: ${REQUEST_LIMIT},
          skip: ${skip},
          where: {currentVersion_not: null, entityVersion: 2}
        ) {
          id
          active
          metadata {
            image
            displayName
          }
          owner {
            id
          }
          currentVersion {
            id
            createdAt
            subgraphDeployment {
              id
              signalledTokens
              stakedTokens
              indexingRewardAmount
              queryFeesAmount
              deniedAt
              manifest {
                network
              }
              versions(
                first: ${REQUEST_LIMIT}, 
                where: {entityVersion: 2}
              ) {
                id
                subgraph {
                  id
                  currentVersion {
                    id
                    subgraphDeployment {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
  );

  return subgraphs;
};

export const useSubgraphs = () => {
  const { data: networkData } = useGraphNetwork();

  return useQuery<SubgraphsData>(
    ["subgraphs"],
    async () => {
      if (!networkData) {
        return Promise.reject(
          new Error("Subgraphs request cannot be sent without network data."),
        );
      }

      const subgraphs = await fetchAllParallel(
        networkData.subgraphCount,
        fetchSubgraphs,
      );
      const { totalTokensAllocated, totalTokensSignalled } = networkData;

      return { subgraphs, totalTokensAllocated, totalTokensSignalled };
    },
    { enabled: Boolean(networkData) },
  );
};
