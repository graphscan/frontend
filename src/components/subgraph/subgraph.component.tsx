import { useSubgraphVersion } from './subgraph.service';
import { SubgraphCards } from './components/subgraph-cards/subgraph-cards.component';
import { SubgraphTabs } from './components/subgraph-tabs/subgraph-tabs.component';
import { AccountPreloader } from '../common/account-preloader/account-preloader.component';
import { Empty } from '../common/empty/empty.component';

type Props = {
  id: string;
  isLite: boolean;
};

export const Subgraph: React.FC<Props> = ({ id, isLite }) => {
  const { data, error, isLoading } = useSubgraphVersion(id);

  if (isLoading) {
    return <AccountPreloader />;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return <Empty />;
  }

  if (!data) {
    return <Empty />;
  }

  const { accountCardData, descriptionCardData, tabsData } = data;

  return (
    <>
      <SubgraphCards accountCardData={accountCardData} descriptionCardData={descriptionCardData} />
      <SubgraphTabs isLite={isLite} versionId={id} {...tabsData} />
    </>
  );
};
