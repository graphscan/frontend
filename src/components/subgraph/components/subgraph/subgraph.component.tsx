import { useSubgraphVersion } from "./subgraph.service";
import { SubgraphCards } from "../subgraph-cards/subgraph-cards.component";
import { SubgraphTabs } from "./components/subgraph-tabs/subgraph-tabs.component";
import { AccountPreloader } from "../../../common/account-preloader/account-preloader.component";
import { Empty } from "../../../common/empty/empty.component";

type Props = {
  id: string;
};

export const Subgraph: React.FC<Props> = ({ id }) => {
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
      <SubgraphCards
        accountCardData={accountCardData}
        descriptionCardData={descriptionCardData}
      />
      <SubgraphTabs versionId={id} {...tabsData} />
    </>
  );
};
