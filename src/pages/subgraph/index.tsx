import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Subgraph } from "../../components/subgraph/subgraph.component";
import { NotFound } from "../../components/not-found/not-found.component";

const SubgraphPage: NextPage = () => {
  const { query } = useRouter();

  const version = query.version;

  return typeof version === "string" ? <Subgraph id={version} /> : <NotFound />;
};

export default SubgraphPage;
