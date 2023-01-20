import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { SignalLite, NameSignalLite, transformToRow } from './subgraph-curators-lite.model';
import { fetchAllConsecutively, request, REQUEST_LIMIT } from '../../../../../../services/graphql.service';

const createBaseSignalFragment = (entity: 'NameSignal' | 'Signal') => gql`
  fragment SignalFragment on ${entity} {
    id
    curator {
      id
    }
    signalledTokens
    unsignalledTokens
  }
`;

export type NameSignalsResponseLite = {
  nameSignals: Array<NameSignalLite>;
};

const createNameSignalsFetcher = (subgraphId: string, gns: string) => async (skip: number) => {
  const { nameSignals } = await request<NameSignalsResponseLite>(gql`
    ${createBaseSignalFragment('NameSignal')}
    query {
      nameSignals(
        first: ${REQUEST_LIMIT},
        skip: ${skip},
        where: { 
          subgraph: ${JSON.stringify(subgraphId.startsWith('0x') ? subgraphId.toLowerCase() : subgraphId)}, 
          curator_not: ${JSON.stringify(gns)} 
        },
      ) {
        lastNameSignalChange
        nameSignal
        ...SignalFragment
      }
    }
  `);

  return nameSignals;
};

export type SignalsResponseLite = {
  signals: Array<SignalLite>;
};

const createSignalsFetcher = (deploymentId: string, gns: string) => async (skip: number) => {
  const { signals } = await request<SignalsResponseLite>(gql`
    ${createBaseSignalFragment('Signal')}
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

export const useSubgraphCurators = (subgraphIds: Array<string>, deploymentId: string) => {
  return useQuery(['subgraph-curators', deploymentId, ...subgraphIds], async () => {
    const response = await request<GnsResponse>(gql`
      query {
        graphNetwork(id: 1) {
          gns
        }
      }
    `).then(({ graphNetwork: { gns } }) => {
      return Promise.all([
        Promise.all(
          subgraphIds.map((subgraphId) => fetchAllConsecutively(createNameSignalsFetcher(subgraphId, gns))),
        ).then((nameSignals) => nameSignals.flat().map((s) => ({ ...s, type: 'Auto-Migrate' } as const))),
        fetchAllConsecutively(createSignalsFetcher(deploymentId, gns)).then((signals) =>
          signals.map((s) => ({ ...s, type: 'Deployment Signal' } as const)),
        ),
      ]);
    });

    return response.flat().map(transformToRow);
  });
};
