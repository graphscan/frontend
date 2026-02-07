import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import {
  NameSignalTransaction,
  SignalTransaction,
  transformNameSignalToRow,
  transformSignalToRow,
} from "./curator-actions.model";
import {
  fetchAllConsecutively,
  request,
  REQUEST_LIMIT,
} from "../../../../../../services/graphql.service";

type NameSignalTransactionsResponse = {
  nameSignalTransactions: Array<NameSignalTransaction>;
};

type SignalTransactionsResponse = {
  signalTransactions: Array<SignalTransaction>;
};

const createNameSignalFetcher = (id: string) => async (skip: number) => {
  const { nameSignalTransactions } =
    await request<NameSignalTransactionsResponse>(gql`
    query {
      nameSignalTransactions(
        first: ${REQUEST_LIMIT}
        skip: ${skip}
        orderBy: timestamp
        orderDirection: desc
        where: { signer: ${JSON.stringify(id.toLowerCase())} }
      ) {
        id
        timestamp
        type
        nameSignal
        tokens
        subgraph {
          id
          metadata {
            image
            displayName
          }
          currentVersion {
            id
            subgraphDeployment {
              id
            }
          }
        }
      }
    }
  `);

  return nameSignalTransactions;
};

const createSignalFetcher = (id: string) => async (skip: number) => {
  const { signalTransactions } = await request<SignalTransactionsResponse>(gql`
    query {
      signalTransactions(
        first: ${REQUEST_LIMIT}
        skip: ${skip}
        orderBy: timestamp
        orderDirection: desc
        where: { signer: ${JSON.stringify(id.toLowerCase())} }
      ) {
        id
        timestamp
        type
        signal
        tokens
        subgraphDeployment {
          id
          versions(first: 1, orderBy: createdAt, orderDirection: desc) {
            subgraph {
              id
              metadata {
                image
                displayName
              }
              currentVersion {
                id
              }
            }
          }
        }
      }
    }
  `);

  return signalTransactions;
};

export const useCuratorActions = (id: string) => {
  return useQuery(["curator-actions", id], async () => {
    const [nameSignalTransactions, signalTransactions] = await Promise.all([
      fetchAllConsecutively(createNameSignalFetcher(id)),
      fetchAllConsecutively(createSignalFetcher(id)),
    ]);

    const nameSignalRows = nameSignalTransactions.map(transformNameSignalToRow);
    const signalRows = signalTransactions.map(transformSignalToRow);

    // Combine and sort by timestamp descending
    return [...nameSignalRows, ...signalRows].sort(
      (a, b) => b.timestamp - a.timestamp,
    );
  });
};
