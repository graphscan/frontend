import React, { useMemo, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import Link from "next/link";
import { tabs, isHomeTabName } from "./home-tabs.model";
import { Tabs, TabButtons, TabsExtraContent } from "./home-tabs.styled";
import { homeTabsViewModel } from "./home-tabs.model";
import { ExtraContent } from "./components/extra-content/extra-content.component";
import { Indexers } from "./components/indexers/indexers.component";
import { Delegators } from "./components/delegators/delegators.component";
import { Curators } from "./components/curators/curators.component";
import { Subgraphs } from "./components/subgraphs/subgraphs.component";
import { TabButton, TabContent } from "../../../common/tabs/tabs.styled";

const createAsPath = (tabKey: keyof typeof tabs) => `/#${tabs[tabKey]}`;

export const HomeTabs: React.FC = observer(() => {
  const { normalizedSearchTerm, activeTab, setActiveTab } = homeTabsViewModel;

  const { pathname, asPath, replace } = useRouter();
  const href = useMemo(() => ({ pathname }), [pathname]);

  useEffect(() => {
    const tab = asPath.split("#")[1];

    if (isHomeTabName(tab)) {
      if (tab !== activeTab) {
        setActiveTab(tab);
      }
    } else {
      replace(href, createAsPath(activeTab));
    }
  }, [activeTab, asPath, href, replace, setActiveTab]);

  const isCurrentIndexTab = (tabName: keyof typeof tabs) =>
    tabName === activeTab;
  const isIndexers = isCurrentIndexTab("indexers");
  const isDelegators = isCurrentIndexTab("delegators");
  const isCurators = isCurrentIndexTab("curators");
  const isSubgraphs = isCurrentIndexTab("subgraphs");

  return (
    <>
      <Tabs>
        <TabButtons>
          <Link href={href} as={createAsPath("indexers")}>
            <TabButton $active={isIndexers}>Indexers</TabButton>
          </Link>
          <Link href={href} as={createAsPath("delegators")}>
            <TabButton $active={isDelegators}>Delegators</TabButton>
          </Link>
          <Link href={href} as={createAsPath("curators")}>
            <TabButton $active={isCurators}>Curators</TabButton>
          </Link>
          <Link href={href} as={createAsPath("subgraphs")}>
            <TabButton $active={isSubgraphs}>Subgraphs</TabButton>
          </Link>
        </TabButtons>
        <TabsExtraContent>
          <ExtraContent />
        </TabsExtraContent>
      </Tabs>
      <TabContent>
        {isIndexers && <Indexers searchTerm={normalizedSearchTerm} />}
        {isDelegators && <Delegators searchTerm={normalizedSearchTerm} />}
        {isCurators && <Curators searchTerm={normalizedSearchTerm} />}
        {isSubgraphs && <Subgraphs searchTerm={normalizedSearchTerm} />}
      </TabContent>
    </>
  );
});
