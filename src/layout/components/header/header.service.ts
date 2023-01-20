import { useQuery } from '@tanstack/react-query';
import { gql } from 'graphql-request';
import { request } from '../../../services/graphql.service';
import { web3Client } from '../../../services/web3.service';

const ACCEPTABLE_DELAY = 10;

type BlockResponse = {
  _meta: {
    block: {
      number: number;
    };
  };
};

export const useNodeDelay = () => {
  return useQuery(
    ['node-delay'],
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
      const isDelayed = delay > ACCEPTABLE_DELAY;

      return {
        delay,
        isDelayed,
      };
    },
    { cacheTime: 0 },
  );
};
