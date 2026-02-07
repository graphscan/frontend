import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEthers } from "@usedapp/core";
import { gql } from "graphql-request";
import { ethers } from "ethers";
import addresses from "@graphprotocol/contracts/addresses.json";
import stakingAbi from "@graphprotocol/contracts/dist/abis/StakingExtension.json";
import tokenLockWalletAbi from "../../../../../../../../services/abi/tokenLockWalletAbi.json";
import { DELEGATOR_DELEGATIONS_CACHE_KEY } from "../../../../../../../../services/delegator-delegations.service";
import { request } from "../../../../../../../../services/graphql.service";
import {
  getGasLimit,
  getSupportedChainId,
  switchNetwork,
} from "../../../../../../../../utils/web3.utils";

const withdraw = async (indexerId: string, currentAddress: string | null) => {
  if (!(window as any).ethereum) {
    throw new Error("Metamask must be connected");
  }

  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();
  const account = await signer.getAddress();
  const currentChainId = await signer.getChainId();
  const chainId = getSupportedChainId();

  if (String(currentChainId) !== chainId) {
    return switchNetwork();
  }

  const chainAddresses = addresses[chainId];
  const stakingAddress = chainAddresses.L2Staking.address;

  const contract =
    !currentAddress || currentAddress === account.toLowerCase()
      ? new ethers.Contract(stakingAddress, stakingAbi, signer)
      : new ethers.Contract(currentAddress, tokenLockWalletAbi, signer);

  const functionName = "withdrawDelegated";
  const args = [indexerId, ethers.constants.AddressZero];
  const gasLimit = await getGasLimit(contract, functionName, ...args);

  const txResponse = await contract[functionName](...args, {
    gasLimit,
  });

  await txResponse.wait();
};

export const useWithdraw = (
  indexerId: string,
  currentAddress: string | null,
) => {
  const client = useQueryClient();
  const { account } = useEthers();

  return useMutation(() => withdraw(indexerId, currentAddress), {
    onSuccess: () => {
      client.invalidateQueries([
        DELEGATOR_DELEGATIONS_CACHE_KEY,
        account?.toLowerCase(),
      ]);
      if (currentAddress) {
        client.invalidateQueries([
          DELEGATOR_DELEGATIONS_CACHE_KEY,
          currentAddress,
        ]);
      }
    },
  });
};

type EpochResponse = {
  graphNetwork: {
    id: "1";
    currentEpoch: number;
    epochLength: number;
  };
  epoches: Array<{ id: string }>;
};

type BlocksResponse = {
  epoch: {
    id: string;
    endBlock: number;
  };
};

export const useEpochData = () => {
  return useQuery(
    ["epoch-data"],
    async () => {
      const {
        graphNetwork: { epochLength },
        epoches: [{ id: currentEpoch }],
      } = await request<EpochResponse>(gql`
        query {
          graphNetwork(id: "1") {
            id
            currentEpoch
            epochLength
          }
          epoches(first: 1, orderBy: startBlock, orderDirection: desc) {
            id
          }
        }
      `);

      const ethMainnetProvider = new ethers.providers.JsonRpcProvider(
        "https://mainnet.infura.io/v3/ac0542a7b0664895a4dc1018075aa927",
      );

      const [
        {
          epoch: { endBlock },
        },
        currentBlock,
      ] = await Promise.all([
        request<BlocksResponse>(gql`
          query {
            epoch(id: ${currentEpoch}) {
              id
              endBlock
            }
          }
        `),
        ethMainnetProvider.getBlockNumber(),
      ]);

      return {
        currentEpoch: Number(currentEpoch),
        epochLength,
        currentEpochEndBlock: endBlock,
        currentBlock,
      };
    },
    { cacheTime: 0 },
  );
};
