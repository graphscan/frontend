import React from "react";
import Head from "next/head";
import { Section, LayoutWrapper } from "./layout.styled";
import { Header } from "./components/header/header.component";
import { TechnicalWorks } from "./components/technical-works/technical-works.component";
import { getEnvVariables } from "../utils/env.utils";

type Props = {
  title: string;
  children?: React.ReactNode;
};

export const Layout: React.FC<Props> = ({ children, title }) => {
  const { isTechnicalWorks } = getEnvVariables();

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <LayoutWrapper>
        <Header isTechicalWorks={isTechnicalWorks} />
        <Section>{isTechnicalWorks ? <TechnicalWorks /> : children}</Section>
      </LayoutWrapper>
    </>
  );
};
