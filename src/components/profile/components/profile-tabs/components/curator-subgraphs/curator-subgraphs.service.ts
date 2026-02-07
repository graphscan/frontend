import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { NameSignal, Signal, transformToRow } from "./curator-subgraphs.model";
import {
  fetchAllConsecutively,
  request,
  REQUEST_LIMIT,
} from "../../../../../../services/graphql.service";

const subgraphFragment = gql`
  fragment CuratorSubgraphFragment on Subgraph {
    id
    active
    createdAt
    metadata {
      image
      displayName
    }
    owner {
      id
    }
    currentVersion {
      id
      subgraphDeployment {
        id
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
  }
`;

type NameSignalsResponse = {
  nameSignals: Array<NameSignal>;
};

const createNameSignalsFetcher = (id: string) => async (skip: number) => {
  const { nameSignals } = await request<NameSignalsResponse>(gql`
    ${subgraphFragment}
    query {
      nameSignals(
        first: ${REQUEST_LIMIT},
        skip: ${skip}
        where: {curator: ${JSON.stringify(id.toLowerCase())}}
      ) {
        id
        currentGRTValue: nameSignalAverageCostBasis
        signalledTokens
        unsignalledTokens
        nameSignal
        lastNameSignalChange
        subgraph {
          ...CuratorSubgraphFragment
          versions(first: ${REQUEST_LIMIT}, where: {entityVersion: 2}) {
            id
            createdAt
          }
        }
      }
    }
  `);

  return nameSignals;
};

type SignalsResponse = {
  signals: Array<Signal>;
};

const createSignalsFetcher = (id: string) => async (skip: number) => {
  const { signals } = await request<SignalsResponse>(gql`
    ${subgraphFragment}
    query getCuratorSubgraphsSignals {
      signals(
        first: ${REQUEST_LIMIT},
        skip: ${skip}
        where: {curator: ${JSON.stringify(id.toLowerCase())}}
      ) {
        id
        currentGRTValue: averageCostBasis
        signalledTokens
        unsignalledTokens
        signal
        lastSignalChange
        createdAt
        subgraphDeployment {
          id
          versions(first: ${REQUEST_LIMIT}, where: {entityVersion: 2}) {
            id
            subgraph {
              ...CuratorSubgraphFragment
            }
          }
        }
      }
    }
  `);

  return signals;
};

export const useCuratorSubgraphs = (id: string) => {
  return useQuery(["curator-subgraphs", id], async () => {
    const [nameSignals, signals] = await Promise.all([
      fetchAllConsecutively(createNameSignalsFetcher(id)),
      fetchAllConsecutively(createSignalsFetcher(id)),
    ]);

    const nameSignalsRows = nameSignals.map((s) =>
      transformToRow({ ...s, type: "Auto-Migrate" }),
    );
    const signalsRows = signals.map((s) =>
      transformToRow({ ...s, type: "Deployment Signal" }),
    );

    return [...nameSignalsRows, ...signalsRows];
  });
};
