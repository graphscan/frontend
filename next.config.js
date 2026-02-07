// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  compiler: {
    styledComponents: true,
  },
  env: {
    IS_TECHNICAL_WORKS: process.env.IS_TECHNICAL_WORKS,
    WARNING_MESSAGE: process.env.WARNING_MESSAGE,
    SUBGRAPH_ANALYTICS_URL: process.env.SUBGRAPH_ANALYTICS_URL,
    SUBGRAPH_MAIN_URL: process.env.SUBGRAPH_MAIN_URL,
    WEB3_RPC: process.env.WEB3_RPC,
    ETHEREUM_EXPLORER: process.env.ETHEREUM_EXPLORER,
    THEGRAPH_EXPLORER: process.env.THEGRAPH_EXPLORER,
    CHAINS: process.env.CHAINS,
    ACCEPTABLE_DELAY: process.env.ACCEPTABLE_DELAY,
    PARTNERS: process.env.PARTNERS,
    WEB3ALERT_URL: process.env.WEB3ALERT_URL,
    ENS_URL: process.env.ENS_URL,
    GRAPH_API_KEY: process.env.GRAPH_API_KEY,
  },
};

export default nextConfig;
