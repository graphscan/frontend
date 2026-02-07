import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { Signal, NameSignal, transformToRow } from "./subgraph-curators.model";
import {
  fetchAllConsecutively,
  request,
  REQUEST_LIMIT,
} from "../../../../../../../../services/graphql.service";

const createBaseSignalFragment = (entity: "NameSignal" | "Signal") => gql`
  fragment SignalFragment on ${entity} {
    id
    curator {
      id
    }
    signalledTokens
    unsignalledTokens
  }
`;

export type NameSignalsResponse = {
  nameSignals: Array<NameSignal>;
};

const createNameSignalsFetcher =
  (subgraphId: string, gns: string) => async (skip: number) => {
    const { nameSignals } = await request<NameSignalsResponse>(gql`
    ${createBaseSignalFragment("NameSignal")}
    query {
      nameSignals(
        first: ${REQUEST_LIMIT},
        skip: ${skip},
        where: { 
          subgraph: ${JSON.stringify(subgraphId.startsWith("0x") ? subgraphId.toLowerCase() : subgraphId)}, 
          curator_not: ${JSON.stringify(gns)} 
        },
      ) {
        lastNameSignalChange
        nameSignal
        currentGRTValue: nameSignalAverageCostBasis
        ...SignalFragment
      }
    }
  `);

    return nameSignals;
  };

export type SignalsResponse = {
  signals: Array<Signal>;
};

const createSignalsFetcher =
  (deploymentId: string, gns: string) => async (skip: number) => {
    const { signals } = await request<SignalsResponse>(gql`
    ${createBaseSignalFragment("Signal")}
    query {
      signals(
        first: ${REQUEST_LIMIT},
        skip: ${skip},
        where: { 
          subgraphDeployment: ${JSON.stringify(deploymentId.toLowerCase())},
          curator_not: ${JSON.stringify(gns)} 
        },
      ) {
        lastSignalChange
        signal
        currentGRTValue: averageCostBasis
        ...SignalFragment
      }
    }
  `);

    return signals;
  };

type GnsResponse = {
  graphNetwork: {
    gns: string;
  };
};

export const useSubgraphCurators = (
  subgraphIds: Array<string>,
  deploymentId: string,
) => {
  return useQuery(
    ["subgraph-curators", deploymentId, ...subgraphIds],
    async () => {
      const response = await request<GnsResponse>(gql`
        query {
          graphNetwork(id: 1) {
            gns
          }
        }
      `).then(({ graphNetwork: { gns } }) => {
        return Promise.all([
          Promise.all(
            subgraphIds.map((subgraphId) =>
              fetchAllConsecutively(createNameSignalsFetcher(subgraphId, gns)),
            ),
          ).then((nameSignals) =>
            nameSignals
              .flat()
              .map((s) => ({ ...s, type: "Auto-Migrate" }) as const),
          ),
          fetchAllConsecutively(createSignalsFetcher(deploymentId, gns)).then(
            (signals) =>
              signals.map(
                (s) => ({ ...s, type: "Deployment Signal" }) as const,
              ),
          ),
        ]);
      });

      return response.flat().map(transformToRow);
    },
  );
};
