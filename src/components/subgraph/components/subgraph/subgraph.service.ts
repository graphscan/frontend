import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { SubgraphVersion, transform } from "./subgraph.model";
import { request, REQUEST_LIMIT } from "../../../../services/graphql.service";

export type SubgraphVersionResponse = {
  subgraphVersion: SubgraphVersion | null;
};

export const useSubgraphVersion = (id: string) => {
  return useQuery(["subgraph-version", id], async () => {
    const { subgraphVersion } = await request<SubgraphVersionResponse>(
      gql`
        query {
          subgraphVersion(id: ${JSON.stringify(id.startsWith("0x") ? id.toLowerCase() : id)}) {
            id
            createdAt
            subgraph {
              id
              active
              creatorAddress
              metadata {
                displayName
                image
                description
              }
              owner {
                id
              }
              currentVersion {
                id
                subgraphDeployment {
                  id
                  versions(
                    first: ${REQUEST_LIMIT},
                    where: {entityVersion: 2}
                  ) {
                    id
                    subgraph {
                      id
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
                          deniedAt
                        }
                      }
                    }
                  }
                }
              }
              versions(
                first: ${REQUEST_LIMIT},
                orderBy: "createdAt",
                orderDirection: "desc"
                where: {entityVersion: ${id.startsWith("0x") ? 1 : 2}}
              ) {
                id
                metadata {
                  label
                }
              }
            }
            subgraphDeployment {
              id
              signalledTokens
              stakedTokens
              deniedAt
            }
          }
        }
      `,
    );

    return subgraphVersion ? transform(subgraphVersion) : null;
  });
};
