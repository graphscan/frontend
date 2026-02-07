import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { request } from "../../../services/graphql.service";
import { web3Client } from "../../../services/web3.service";
import { getEnvVariables } from "../../../utils/env.utils";

type BlockResponse = {
  _meta: {
    block: {
      number: number;
    };
  };
};

export const useNodeDelay = () => {
  return useQuery(
    ["node-delay"],
    async () => {
      const [
        {
          _meta: {
            block: { number: nodeBlockNumber },
          },
        },
        currentBlockNumber,
      ] = await Promise.all([
        request<BlockResponse>(gql`
          query {
            _meta {
              block {
                number
              }
            }
          }
        `),
        web3Client.getBlockNumber(),
      ]);

      const delay = currentBlockNumber - nodeBlockNumber;
      const isDelayed = delay > getEnvVariables().acceptableDelay;

      return {
        delay,
        isDelayed,
      };
    },
    { cacheTime: 0 },
  );
};
