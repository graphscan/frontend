import { memo } from 'react';
import { useRouter } from 'next/router';
import { Subgraph } from '../../components/subgraph/subgraph.component';
import { NotFound } from '../../components/not-found/not-found.component';
import { getEnvVariables } from '../../utils/env.utils';

const SubgraphPage = memo(() => {
  const {
    query: { version },
  } = useRouter();

  return typeof version === 'string' ? (
    <Subgraph id={version} isLite={getEnvVariables().isLite} />
  ) : (
    <NotFound />
  );
});

export default SubgraphPage;
