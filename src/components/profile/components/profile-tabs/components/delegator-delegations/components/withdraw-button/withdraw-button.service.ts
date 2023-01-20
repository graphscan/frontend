import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEthers } from '@usedapp/core';
import { gql } from 'graphql-request';
import { ethers } from 'ethers';
import addresses from '@graphprotocol/contracts/addresses.json';
import stakingAbi from '@graphprotocol/contracts/dist/abis/Staking.json';
import tokenLockWalletAbi from '../../../../../../../../services/abi/tokenLockWalletAbi.json';
import { DELEGATOR_DELEGATIONS_CACHE_KEY } from '../../../../../../../../services/delegator-delegations.service';
import { request } from '../../../../../../../../services/graphql.service';
import { getSupportedChainId, switchNetwork } from '../../../../../../../../utils/web3.utils';

const withdraw = async (indexerId: string, currentAddress: string | null) => {
  if (!window.ethereum) {
    throw new Error('Metamask must be connected');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const account = await signer.getAddress();
  const currentChainId = await signer.getChainId();
  const chainId = getSupportedChainId();

  if (String(currentChainId) !== chainId) {
    return switchNetwork();
  }

  const contract =
    !currentAddress || currentAddress === account.toLowerCase()
      ? new ethers.Contract(addresses[chainId].Staking.address, stakingAbi, signer)
      : new ethers.Contract(currentAddress, tokenLockWalletAbi, signer);

  let gasLimit;
  try {
    gasLimit =
      1.2 *
      (await contract.estimateGas.withdrawDelegated(indexerId, ethers.constants.AddressZero)).toNumber();
  } catch {
    gasLimit = 150000;
  }

  const txResponse = await contract.withdrawDelegated(indexerId, ethers.constants.AddressZero, {
    gasLimit: Math.round(gasLimit),
  });

  await txResponse.wait();
};

export const useWithdraw = (indexerId: string, currentAddress: string | null) => {
  const client = useQueryClient();
  const { account } = useEthers();

  return useMutation(() => withdraw(indexerId, currentAddress), {
    onSuccess: () => {
      client.invalidateQueries([DELEGATOR_DELEGATIONS_CACHE_KEY, account?.toLowerCase()]);
      if (currentAddress) {
        client.invalidateQueries([DELEGATOR_DELEGATIONS_CACHE_KEY, currentAddress]);
      }
    },
  });
};

type EpochResponse = {
  graphNetwork: {
    id: '1';
    currentEpoch: number;
    epochLength: number;
  };
};

type BlocksResponse = {
  epoch: {
    id: string;
    endBlock: number;
  };
  _meta: {
    block: {
      number: number;
    };
  };
};

export const useEpochData = () => {
  return useQuery(
    ['epoch-data'],
    async () => {
      const {
        graphNetwork: { currentEpoch, epochLength },
      } = await request<EpochResponse>(gql`
        query {
          graphNetwork(id: "1") {
            id
            currentEpoch
            epochLength
          }
        }
      `);

      const {
        epoch: { endBlock },
        _meta: {
          block: { number },
        },
      } = await request<BlocksResponse>(gql`
      query {
        epoch(id: ${String(currentEpoch)}) {
          id
          endBlock
        }
        _meta {
          block {
            number
          }
        }
      }
    `);

      return {
        currentEpoch,
        epochLength,
        currentEpochEndBlock: endBlock,
        currentBlock: number,
      };
    },
    { cacheTime: 0 },
  );
};
