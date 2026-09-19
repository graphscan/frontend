import { useQuery, useQueryClient } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { request } from "../../../services/graphql.service";
import { web3Client } from "../../../services/web3.service";
import { getEnvVariables } from "../../../utils/env.utils";
import {
  NodeDelay,
  NODE_DELAY_POLL_INTERVAL_MS,
  updateNodeDelay,
} from "../../../utils/node-delay.utils";

type BlockResponse = {
  _meta: {
    block: {
      timestamp: number | null;
    };
  };
};

export const useNodeDelay = () => {
  const queryClient = useQueryClient();
  const thresholdSeconds = getEnvVariables().acceptableDelaySeconds;
  const queryKey = ["node-delay-seconds", thresholdSeconds];
  return useQuery(
    queryKey,
    async () => {
      const [
        {
          _meta: {
            block: { timestamp: nodeTimestamp },
          },
        },
        currentBlock,
      ] = await Promise.all([
        request<BlockResponse>(gql`
          query {
            _meta {
              block {
                timestamp
              }
            }
          }
        `),
        web3Client.getBlock("latest"),
      ]);

      if (
        !currentBlock ||
        !Number.isFinite(currentBlock.timestamp) ||
        currentBlock.timestamp <= 0 ||
        nodeTimestamp === null ||
        !Number.isFinite(nodeTimestamp) ||
        nodeTimestamp <= 0
      ) {
        throw new Error("Subgraph or network block timestamp is unavailable");
      }

      // Compare chain timestamps, not the visitor's wall clock or block count.
      const delaySeconds = Math.max(0, currentBlock.timestamp - nodeTimestamp);
      const previous =
        queryClient.getQueryState(queryKey)?.status === "error"
          ? undefined
          : queryClient.getQueryData<NodeDelay>(queryKey);
      return updateNodeDelay(
        delaySeconds,
        previous,
        thresholdSeconds,
        Date.now(),
      );
    },
    {
      staleTime: NODE_DELAY_POLL_INTERVAL_MS,
      refetchInterval: NODE_DELAY_POLL_INTERVAL_MS,
      refetchOnWindowFocus: "always",
      cacheTime: 0,
    },
  );
};
