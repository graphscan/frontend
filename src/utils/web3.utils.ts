import { useEffect, useState } from "react";
import { ethers, BigNumber } from "ethers";
import addresses from "@graphprotocol/contracts/addresses.json";
import grtTokenAbi from "@graphprotocol/contracts/dist/abis/GraphToken.json";
import { divideBy1e18 } from "./number.utils";
import { isKey } from "./object.utils";

import { web3Client } from "../services/web3.service";

export const getGasLimit = async (
  contract: ethers.Contract,
  functionName: string,
  ...args: Array<unknown>
) => {
  try {
    const estimated = await contract.estimateGas[functionName](...args);
    return estimated.mul(11).div(10);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Failed to estimate gas limit", e);
    return BigNumber.from(3000000);
  }
};

export const getSupportedChainId = () => {
  const chainId = "42161" as const;

  if (!isKey(chainId, addresses)) {
    throw new Error("Provided CHAIN_ID is not supported");
  }

  return chainId;
};

export const useGRTBalance = (account: string | null | undefined) => {
  const [balance, setBalance] = useState(BigNumber.from(0));

  useEffect(() => {
    setBalance(BigNumber.from(0));

    const chainId = getSupportedChainId();

    if (!account) {
      return;
    }

    const chainAddresses = addresses[chainId];

    const tokenAddress = chainAddresses.L2GraphToken.address;

    const token = new ethers.Contract(
      tokenAddress,
      grtTokenAbi,
      web3Client.getSigner(account),
    );

    const updateBalance = async () => {
      setBalance(await token.balanceOf(account));
    };

    updateBalance();

    const transferFromFilter = token.filters.Transfer(account);
    const transferToFilter = token.filters.Transfer(null, account);

    token.on(transferFromFilter, updateBalance);
    token.on(transferToFilter, updateBalance);

    return () => {
      token.off(transferFromFilter, updateBalance);
      token.off(transferToFilter, updateBalance);
    };
  }, [account]);

  return balance;
};

export const switchNetwork = async () =>
  window?.ethereum?.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: ethers.utils.hexValue(Number(getSupportedChainId())) }],
  });

export const stringToBigNumber = (value: string) =>
  ethers.utils.parseUnits(value, 18);

export const bigNumberToGRT = (value: BigNumber) => divideBy1e18(String(value));
