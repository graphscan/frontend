module.exports = {
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  publicRuntimeConfig: {
    IS_TECHNICAL_WORKS: process.env.IS_TECHNICAL_WORKS === 'true',
    USE_MAIN_NETWORK_SUBGRAPH: process.env.USE_MAIN_NETWORK_SUBGRAPH === 'true',
    WARNING_MESSAGE: process.env.WARNING_MESSAGE,
    SUBGRAPH_URL: process.env.SUBGRAPH_URL,
    WEB3_RPC: process.env.WEB3_RPC,
    CHAIN_ID: process.env.CHAIN_ID,
    ETHEREUM_EXPLORER: process.env.ETHEREUM_EXPLORER,
    THEGRAPH_EXPLORER: process.env.THEGRAPH_EXPLORER,
    CHAINS: process.env.CHAINS,
    ENDPOINT_SWITCH_WHITELIST: process.env.ENDPOINT_SWITCH_WHITELIST,
  },
};
