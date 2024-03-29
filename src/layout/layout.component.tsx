import React from 'react';
import Head from 'next/head';
import { Section, LayoutWrapper } from './layout.styled';
import { Cookies } from './components/cookies/cookies.component';
import { Header } from './components/header/header.component';
import { TechnicalWorks } from './components/technical-works/technical-works.component';
import { useMounted } from '../utils/ssr.utils';
import { getEnvVariables } from '../utils/env.utils';

type Props = {
  title: string;
};

export const Layout: React.FC<Props> = ({ children, title }) => {
  const { isTechnicalWorks } = getEnvVariables();

  const mounted = useMounted();

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <LayoutWrapper>
        <Header isTechicalWorks={isTechnicalWorks} />
        <Section>{isTechnicalWorks ? <TechnicalWorks /> : children}</Section>
        {mounted && <Cookies />}
      </LayoutWrapper>
    </>
  );
};
