export const getEnvVariables = () => ({
  isProduction: process.env.NODE_ENV === "production",
  isTechnicalWorks: process.env.NEXT_PUBLIC_IS_TECHNICAL_WORKS === "true",
  warningMessage:
    typeof process.env.NEXT_PUBLIC_WARNING_MESSAGE === "string" &&
    process.env.NEXT_PUBLIC_WARNING_MESSAGE.length > 0 &&
    process.env.NEXT_PUBLIC_WARNING_MESSAGE !== "false"
      ? process.env.NEXT_PUBLIC_WARNING_MESSAGE
      : null,
  subgraphAnalyticsUrl: process.env.NEXT_PUBLIC_SUBGRAPH_ANALYTICS_URL!,
  subgraphMainUrl: process.env.NEXT_PUBLIC_SUBGRAPH_MAIN_URL!,
  web3Rpc: process.env.NEXT_PUBLIC_WEB3_RPC!,
  ethereumExplorer: process.env.NEXT_PUBLIC_ETHEREUM_EXPLORER,
  thegraphExplorer: process.env.NEXT_PUBLIC_THEGRAPH_EXPLORER,
  acceptableDelay: Number(process.env.NEXT_PUBLIC_ACCEPTABLE_DELAY),
  partners:
    typeof process.env.NEXT_PUBLIC_PARTNERS === "string" && process.env.NEXT_PUBLIC_PARTNERS.length > 0
      ? process.env.NEXT_PUBLIC_PARTNERS.split(",").map((p: string) => {
          const [name, address] = p.split("::");

          return {
            name,
            address,
          };
        })
      : [],
  ensUrl: process.env.NEXT_PUBLIC_ENS_URL!,
  graphApiKey: process.env.NEXT_PUBLIC_GRAPH_API_KEY!,
});
