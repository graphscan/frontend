import { useQuery } from "@tanstack/react-query";
import { Contract } from "ethers";
import { GraphNetwork } from "../model/graph-network.model";
import { web3Client } from "./web3.service";
import { CURRENT_DATA_QUERY_OPTIONS } from "./query-policy";

export type RewardParameters = {
  networkGRTIssuancePerBlock: string;
  totalTokensSignalled: string;
  minimumSubgraphSignal: string;
};

type RewardContracts = Pick<
  GraphNetwork,
  "rewardsManager" | "graphToken" | "curation"
>;

export const fetchRewardParameters = async (
  network: RewardContracts,
): Promise<RewardParameters> => {
  const rewards = new Contract(
    network.rewardsManager,
    [
      "function getAllocatedIssuancePerBlock() view returns (uint256)",
      "function minimumSubgraphSignal() view returns (uint256)",
    ],
    web3Client,
  );
  const token = new Contract(
    network.graphToken,
    ["function balanceOf(address) view returns (uint256)"],
    web3Client,
  );
  // RewardsManager divides by the actual Curation balance. The subgraph's
  // totalTokensSignalled aggregate can drift from this on-chain denominator.
  const [issuance, signal, minimum] = await Promise.all([
    rewards.getAllocatedIssuancePerBlock(),
    token.balanceOf(network.curation),
    rewards.minimumSubgraphSignal(),
  ]);
  return {
    networkGRTIssuancePerBlock: issuance.toString(),
    totalTokensSignalled: signal.toString(),
    minimumSubgraphSignal: minimum.toString(),
  };
};

export const useRewardParameters = (network?: RewardContracts) =>
  useQuery(
    [
      "reward-parameters",
      network?.rewardsManager,
      network?.graphToken,
      network?.curation,
    ],
    () => fetchRewardParameters(network!),
    { ...CURRENT_DATA_QUERY_OPTIONS, enabled: Boolean(network) },
  );
