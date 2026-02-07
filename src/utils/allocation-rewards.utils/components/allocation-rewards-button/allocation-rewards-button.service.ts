import { ethers } from "ethers";
import { web3Client } from "../../../../services/web3.service";
import { bigNumberToGRT } from "../../../web3.utils";

// New RewardsManager contract address
const REWARDS_MANAGER_ADDRESS = "0x971B9d3d0Ae3ECa029CAB5eA1fB0F72c85e6a525";

// ABI for getRewards function
const REWARDS_MANAGER_ABI = [
  "function getRewards(address _rewardsIssuer, address _allocationID) external view returns (uint256)",
];

export const getAllocationRewards = async (
  allocationId: string,
  indexingRewardCut: number,
  rewardsIssuer: string,
) => {
  const contract = new ethers.Contract(
    REWARDS_MANAGER_ADDRESS,
    REWARDS_MANAGER_ABI,
    web3Client,
  );

  const rewards = bigNumberToGRT(
    await contract.getRewards(rewardsIssuer, allocationId),
  );
  const potentialIndexerRewards = rewards * indexingRewardCut;

  return {
    potentialIndexerRewards,
    potentialDelegatorRewards: rewards - potentialIndexerRewards,
  };
};
