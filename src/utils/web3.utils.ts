import { useEffect, useState } from "react";
import { ethers, formatUnits } from "ethers";
import addresses from "@graphprotocol/contracts/addresses.json";
import grtTokenAbi from "@graphprotocol/contracts/dist/abis/GraphToken.json";
import { isKey } from "./object.utils";

import { web3Client } from "../services/web3.service";

export const getSupportedChainId = () => {
  const chainId = "42161" as const;

  if (!isKey(chainId, addresses)) {
    throw new Error("Provided CHAIN_ID is not supported");
  }

  return chainId;
};

export const useGRTBalance = (account: string | null | undefined) => {
  const [balance, setBalance] = useState(0n);

  useEffect(() => {
    setBalance(0n);

    const chainId = getSupportedChainId();

    if (!account) {
      return;
    }

    const chainAddresses = addresses[chainId];

    const tokenAddress = chainAddresses.L2GraphToken.address;

    const token = new ethers.Contract(
      tokenAddress,
      grtTokenAbi,
      web3Client
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

export const bigNumberToGRT = (value: bigint): number =>
  Number(formatUnits(value, 18));
