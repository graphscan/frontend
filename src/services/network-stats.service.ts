import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { request } from "./graphql.service";
import { useGraphNetwork } from "./graph-network.service";
import { NetworkStats } from "../model/network-stats.model";
import { divideBy1e18 } from "../utils/number.utils";

type SubgraphDeploymentsResponse = {
  subgraphDeployments: Array<{ signalledTokens: string }>;
};

export const useNetworkStats = () => {
  const { data: networkData } = useGraphNetwork();

  return useQuery<NetworkStats>(
    ["network-stats"],
    async () => {
      if (!networkData) {
        return Promise.reject(
          new Error("Subgraphs request cannot be sent without network data."),
        );
      }

      const { subgraphDeployments } =
        await request<SubgraphDeploymentsResponse>(gql`
          query {
            subgraphDeployments(where: { deniedAt_gt: 0 }) {
              id
              signalledTokens
            }
          }
        `);

      const totalDeniedSignalledTokens = subgraphDeployments.reduce(
        (acc, { signalledTokens }) => acc + divideBy1e18(signalledTokens),
        0,
      );

      return {
        ...networkData,
        deniedToTotalSignalledRatio:
          totalDeniedSignalledTokens /
          divideBy1e18(networkData.totalTokensSignalled),
      };
    },
    { enabled: Boolean(networkData) },
  );
};
