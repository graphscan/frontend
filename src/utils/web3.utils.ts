import { useEffect, useState } from "react";
import { ethers, formatUnits } from "ethers";

import { web3Client } from "../services/web3.service";

export const getSupportedChainId = () => {
  const chainId = "42161" as const;

  return chainId;
};
const grtTokenAbi = [
  "function balanceOf(address owner) view returns (uint256)",
]
export const useGRTBalance = (account: string | null | undefined) => {
  const [balance, setBalance] = useState(0n);

  useEffect(() => {
    setBalance(0n);

    const chainId = getSupportedChainId();

    if (!account) {
      return;
    }


    const tokenAddress = 0x9623063377ad1b27544c965ccd7342f7ea7e88c7;

    const token = new ethers.Contract(tokenAddress, grtTokenAbi, web3Client);

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
