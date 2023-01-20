import { ethers } from 'ethers';
import addresses from '@graphprotocol/contracts/addresses.json';
import rewardsAbi from '@graphprotocol/contracts/dist/abis/RewardsManager.json';
import { web3Client } from '../../../../services/web3.service';
import { bigNumberToGRT, getSupportedChainId } from '../../../web3.utils';

export const getAllocationRewards = async (allocationId: string, indexingRewardCut: number) => {
  const contract = new ethers.Contract(
    addresses[getSupportedChainId()].RewardsManager.address,
    rewardsAbi,
    web3Client,
  );

  const rewards = bigNumberToGRT(await contract.getRewards(allocationId));
  const potentialIndexerRewards = rewards * indexingRewardCut;

  return {
    potentialIndexerRewards,
    potentialDelegatorRewards: rewards - potentialIndexerRewards,
  };
};
