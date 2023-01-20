import { useEffect, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import addresses from '@graphprotocol/contracts/addresses.json';
import grtTokenAbi from '@graphprotocol/contracts/dist/abis/GraphToken.json';
import { divideBy1e18 } from './number.utils';
import { isKey } from './object.utils';
import { getEnvVariables } from './env.utils';
import { web3Client } from '../services/web3.service';

export const getSupportedChainId = () => {
  const chainId = String(getEnvVariables().chainId);

  if (!isKey(chainId, addresses)) {
    throw new Error('Provided CHAIN_ID is not supported');
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

    const token = new ethers.Contract(
      addresses[chainId].GraphToken.address,
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
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: ethers.utils.hexValue(getEnvVariables().chainId) }],
  });

export const stringToBigNumber = (value: string) =>
  BigNumber.from((Number(value) * 1e18).toLocaleString('fullwide', { useGrouping: false }));

export const bigNumberToGRT = (value: BigNumber) => divideBy1e18(String(value));
