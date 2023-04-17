import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DAppProvider } from '@usedapp/core';
import { configure } from 'mobx';
import Head from 'next/head';
import type { AppContext, AppProps } from 'next/app';
import { default as NextApp } from 'next/app';
import { Layout } from '../layout/layout.component';
import { GlobalStyles } from '../styles/styles';
import { Fonts } from '../styles/fonts';
import { Tooltip } from '../components/tooltip/tooltip.component';
import { COOKIES_KEYS } from '../model/cookies.model';
import { HISTORY_APY_REQUEST_TIME_STORAGE_KEY } from '../model/indexers.model';

configure({
  enforceActions: 'observed',
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
    sessionStorage.setItem(HISTORY_APY_REQUEST_TIME_STORAGE_KEY, String(Date.now()));
  }, []);

  const isThirdPartyOn =
    typeof localStorage !== 'undefined' && localStorage.getItem(COOKIES_KEYS.kinds.thirdParty) === 'true';

  return (
    <>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                'ad_storage': ${JSON.stringify(isThirdPartyOn ? 'granted' : 'denied')},
                'analytics_storage': ${JSON.stringify(isThirdPartyOn ? 'granted' : 'denied')},
              });
            `,
          }}
        ></script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5473RBPD53"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5473RBPD53');
            `,
          }}
        ></script>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          // eslint-disable-next-line max-len
          content="Graphscan.io - is a multifunctional tool that helps The Graph Indexers, Delegators, and Curators get detailed and specific network statistics."
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#4c7fea" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#141d2b" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css" rel="stylesheet" />
        <script
          src="https://js.sentry-cdn.com/e5aa565695ef462995311b6836680986.min.js"
          crossOrigin="anonymous"
          data-lazy="no"
        ></script>
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
App.getInitialProps = async (appContext: AppContext) => {
  // disable prerendering everywhere
  return await NextApp.getInitialProps(appContext);
};
export default App;
