import { JsonRpcProvider } from "ethers";
import { getEnvVariables } from "../utils/env.utils";

export const web3Client = new JsonRpcProvider(getEnvVariables().web3Rpc);
