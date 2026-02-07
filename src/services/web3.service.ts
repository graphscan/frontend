import { ethers } from "ethers";
import { getEnvVariables } from "../utils/env.utils";

export const web3Client = new ethers.providers.JsonRpcProvider(
  getEnvVariables().web3Rpc,
);
