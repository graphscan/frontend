import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import {
  fetchAllConsecutively,
  request,
  REQUEST_LIMIT,
} from "./graphql.service";
import { useGraphNetwork } from "./graph-network.service";
import { NetworkStats } from "../model/network-stats.model";
import { divideBy1e18 } from "../utils/number.utils";
import { CURRENT_DATA_QUERY_OPTIONS } from "./query-policy";

type SubgraphDeploymentsResponse = {
  subgraphDeployments: Array<{ signalledTokens: string }>;
};

export const useNetworkStats = () => {
  const network = useGraphNetwork();
  const denied = useQuery(
    ["denied-subgraph-signal"],
    async () => {
      const deployments = await fetchAllConsecutively(async (skip) => {
        const { subgraphDeployments } =
          await request<SubgraphDeploymentsResponse>(gql`
          query {
            subgraphDeployments(first: ${REQUEST_LIMIT}, skip: ${skip}, orderBy: id, orderDirection: asc, where: { deniedAt_gt: 0 }) {
              id
              signalledTokens
            }
          }
        `);
        return subgraphDeployments;
      });
      return deployments.reduce(
        (sum, deployment) => sum + divideBy1e18(deployment.signalledTokens),
        0,
      );
    },
    CURRENT_DATA_QUERY_OPTIONS,
  );
  const data = useMemo<NetworkStats | undefined>(() => {
    if (!network.data || denied.data === undefined) return undefined;
    const totalSignal = divideBy1e18(network.data.totalTokensSignalled);
    return {
      ...network.data,
      deniedToTotalSignalledRatio:
        totalSignal > 0 ? denied.data / totalSignal : 0,
    };
  }, [network.data, denied.data]);
  return {
    data,
    error: network.error || denied.error,
    isLoading: network.isLoading || denied.isLoading,
    isRefetching: network.isRefetching || denied.isRefetching,
  };
};
