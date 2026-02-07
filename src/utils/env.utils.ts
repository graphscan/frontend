export const getEnvVariables = () => ({
  isProduction: process.env.NODE_ENV === "production",
  isTechnicalWorks: process.env.IS_TECHNICAL_WORKS === "true",
  warningMessage:
    typeof process.env.WARNING_MESSAGE === "string" &&
    process.env.WARNING_MESSAGE.length > 0 &&
    process.env.WARNING_MESSAGE !== "false"
      ? process.env.WARNING_MESSAGE
      : null,
  subgraphAnalyticsUrl: process.env.SUBGRAPH_ANALYTICS_URL!,
  subgraphMainUrl: process.env.SUBGRAPH_MAIN_URL!,
  web3Rpc: process.env.WEB3_RPC,
  ethereumExplorer: process.env.ETHEREUM_EXPLORER,
  thegraphExplorer: process.env.THEGRAPH_EXPLORER,
  acceptableDelay: Number(process.env.ACCEPTABLE_DELAY),
  partners:
    typeof process.env.PARTNERS === "string" && process.env.PARTNERS.length > 0
      ? process.env.PARTNERS.split(",").map((p: string) => {
          const [name, address] = p.split("::");

          return {
            name,
            address,
          };
        })
      : [],
  web3AlertUrl: process.env.WEB3ALERT_URL,
  ensUrl: process.env.ENS_URL!,
  graphApiKey: process.env.GRAPH_API_KEY!,
});
