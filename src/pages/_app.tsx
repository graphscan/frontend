import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DAppProvider } from "@usedapp/core";
import { configure } from "mobx";
import Head from "next/head";
import type { AppProps } from "next/app";
import { Layout } from "../layout/layout.component";
import { GlobalStyles } from "../styles/styles";
import { Fonts } from "../styles/fonts";
import { Tooltip } from "../components/tooltip/tooltip.component";
import { COOKIES_KEYS } from "../model/cookies.model";
import { HISTORY_APY_REQUEST_TIME_STORAGE_KEY } from "../model/indexers.model";

configure({
  enforceActions: "observed",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      retry: 0,
      staleTime: Infinity,
    },
  },
});

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    sessionStorage.setItem(
      HISTORY_APY_REQUEST_TIME_STORAGE_KEY,
      String(Date.now())
    );
  }, []);

  const isThirdPartyOn =
    typeof localStorage !== "undefined" &&
    localStorage.getItem(COOKIES_KEYS.kinds.thirdParty) === "true";

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          // eslint-disable-next-line max-len
          content="Graphscan.io - is a multifunctional tool that helps The Graph Indexers, Delegators, and Curators get detailed and specific network statistics."
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#4c7fea"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#141d2b" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <DAppProvider config={{}}>
          <Layout title="Graphscan">
            <Component {...pageProps} />
          </Layout>
        </DAppProvider>
      </QueryClientProvider>
      <Fonts />
      <GlobalStyles />
      <Tooltip />
    </>
  );
};

export default App;
