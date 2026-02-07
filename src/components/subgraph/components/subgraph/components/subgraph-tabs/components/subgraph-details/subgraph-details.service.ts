import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { SubgraphDetails, transform } from "./subgraph-details.model";
import {
  fetchAllConsecutively,
  request,
  REQUEST_LIMIT,
} from "../../../../../../../../services/graphql.service";

type NameSignalsResponse = {
  nameSignals: Array<{
    id: string;
    nameSignal: string;
  }>;
};

const createNameSignalsFetcher =
  (subgraphId: string, gns: string) => async (skip: number) => {
    const { nameSignals } = await request<NameSignalsResponse>(gql`
    query {
      nameSignals(
        first: ${REQUEST_LIMIT},
        skip: ${skip},
        where: { 
          subgraph: ${JSON.stringify(subgraphId.startsWith("0x") ? subgraphId.toLowerCase() : subgraphId)}, 
          curator_not: ${JSON.stringify(gns)} 
        },
      ) {
        id
        nameSignal
      }
    }
  `);

    return nameSignals;
  };

type SignalsResponse = {
  signals: Array<{
    id: string;
    signal: string;
  }>;
};

const createSignalsFetcher =
  (deploymentId: string, gns: string) => async (skip: number) => {
    const { signals } = await request<SignalsResponse>(gql`
    query {
      signals(
        first: ${REQUEST_LIMIT},
        skip: ${skip},
        where: { 
          subgraphDeployment: ${JSON.stringify(deploymentId.toLowerCase())},
          curator_not: ${JSON.stringify(gns)} 
        },
      ) {
        id
        signal
      }
    }
  `);

    return signals;
  };

type SubgraphVersionResponse = {
  subgraphVersion: SubgraphDetails;
};

type GnsResponse = {
  graphNetwork: {
    gns: string;
  };
};

type SubgraphDetailsParams = {
  deploymentId: string;
  versionId: string;
  subgraphId: string;
};

export const useSubgraphDetails = ({
  deploymentId,
  versionId,
  subgraphId,
}: SubgraphDetailsParams) => {
  return useQuery(
    ["subgraph-details", deploymentId, versionId, subgraphId],
    async () => {
      const [{ subgraphVersion }, [nameSignals, signals]] = await Promise.all([
        request<SubgraphVersionResponse>(gql`
        query {
          subgraphVersion(id: ${JSON.stringify(
            versionId.startsWith("0x") ? versionId.toLowerCase() : versionId,
          )}) {
            id
            createdAt
            subgraph {
              id
              creatorAddress
              metadata {
                website
              }
              owner {
                id
              }
            }
            subgraphDeployment {
              id
              signalAmount
              signalledTokens
              queryFeesAmount
              stakedTokens
              indexingRewardAmount
              indexerAllocations {
                indexer {
                  id
                }
              }
              manifest {
                network
              }
            }
          }
        }
      `),
        request<GnsResponse>(gql`
          query {
            graphNetwork(id: 1) {
              gns
            }
          }
        `).then(({ graphNetwork: { gns } }) => {
          return Promise.all([
            fetchAllConsecutively(createNameSignalsFetcher(subgraphId, gns)),
            fetchAllConsecutively(createSignalsFetcher(deploymentId, gns)),
          ]);
        }),
      ]);

      const activeSubgraphCuratorsCount = nameSignals.filter(
        (s) => Number(s.nameSignal) > 0,
      ).length;

      return {
        ...transform(subgraphVersion),
        subgraphCuratorsCount: {
          active: activeSubgraphCuratorsCount,
          total: nameSignals.length,
        },
        deploymentCuratorsCount: {
          active:
            activeSubgraphCuratorsCount +
            signals.filter((s) => Number(s.signal) > 0).length,
          total: signals.length + nameSignals.length,
        },
      };
    },
  );
};
