import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const getEnvVariables = () => ({
  isProduction: process.env.NODE_ENV === 'production',
  isTechnicalWorks: Boolean(publicRuntimeConfig.IS_TECHNICAL_WORKS),
  isLite: Boolean(publicRuntimeConfig.USE_MAIN_NETWORK_SUBGRAPH),
  warningMessage:
    typeof publicRuntimeConfig.WARNING_MESSAGE === 'string' &&
    publicRuntimeConfig.WARNING_MESSAGE.length > 0 &&
    publicRuntimeConfig.WARNING_MESSAGE !== 'false'
      ? publicRuntimeConfig.WARNING_MESSAGE
      : null,
  subgraphUrl: publicRuntimeConfig.SUBGRAPH_URL,
  web3Rpc: publicRuntimeConfig.WEB3_RPC,
  chainId: Number(publicRuntimeConfig.CHAIN_ID),
  chains: publicRuntimeConfig.CHAINS,
  ethereumExplorer: publicRuntimeConfig.ETHEREUM_EXPLORER,
  thegraphExplorer: publicRuntimeConfig.THEGRAPH_EXPLORER,
  endpointSwitchWhitelist: publicRuntimeConfig.ENDPOINT_SWITCH_WHITELIST,
});
