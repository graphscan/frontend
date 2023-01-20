import React, { useMemo, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { tabs, isHomeTabName } from './home-tabs.model';
import { Tabs, TabButtons, TabsExtraContent } from './home-tabs.styled';
import { homeTabsViewModel } from './home-tabs.model';
import { ExtraContent } from './components/extra-content/extra-content.component';
import { Indexers } from './components/indexers/indexers.component';
import { Delegators } from './components/delegators/delegators.component';
import { Curators } from './components/curators/curators.component';
import { Subgraphs } from './components/subgraphs/subgraphs.component';
import { IndexersLite } from './components/indexers-lite/indexers-lite.component';
import { DelegatorsLite } from './components/delegators-lite/delegators-lite.component';
import { CuratorsLite } from './components/curators-lite/curators-lite.component';
import { TabButton, TabContent } from '../../../common/tabs/tabs.styled';

const createAsPath = (tabKey: keyof typeof tabs) => `/#${tabs[tabKey]}`;

type Props = {
  isLite: boolean;
};

export const HomeTabs: React.FC<Props> = observer(({ isLite }) => {
  const {
    normalizedSearchTerm,
    plannedDelegation,
    plannedIndexerCut,
    plannedPeriod,
    activeTab,
    setActiveTab,
  } = homeTabsViewModel;

  const { pathname, asPath, replace } = useRouter();
  const href = useMemo(() => ({ pathname }), [pathname]);

  useEffect(() => {
    const tab = asPath.split('#')[1];

    if (isHomeTabName(tab)) {
      if (tab !== activeTab) {
        setActiveTab(tab);
      }
    } else {
      replace(href, createAsPath(activeTab));
    }
  }, [activeTab, asPath, href, replace, setActiveTab]);

  const isCurrentIndexTab = (tabName: keyof typeof tabs) => tabName === activeTab;
  const isIndexers = isCurrentIndexTab('indexers');
  const isDelegators = isCurrentIndexTab('delegators');
  const isCurators = isCurrentIndexTab('curators');
  const isSubgraphs = isCurrentIndexTab('subgraphs');

  return (
    <>
      <Tabs>
        <TabButtons>
          <Link href={href} as={createAsPath('indexers')} passHref>
            <TabButton active={isIndexers}>Indexers</TabButton>
          </Link>
          <Link href={href} as={createAsPath('delegators')} passHref>
            <TabButton active={isDelegators}>Delegators</TabButton>
          </Link>
          <Link href={href} as={createAsPath('curators')} passHref>
            <TabButton active={isCurators}>Curators</TabButton>
          </Link>
          <Link href={href} as={createAsPath('subgraphs')} passHref>
            <TabButton active={isSubgraphs}>Subgraphs</TabButton>
          </Link>
        </TabButtons>
        <TabsExtraContent>
          <ExtraContent isLite={isLite} withCalculator={isIndexers} />
        </TabsExtraContent>
      </Tabs>
      <TabContent>
        {isIndexers &&
          (isLite ? (
            <IndexersLite
              plannedDelegation={plannedDelegation}
              plannedIndexerCut={plannedIndexerCut}
              searchTerm={normalizedSearchTerm}
            />
          ) : (
            <Indexers
              plannedDelegation={plannedDelegation}
              plannedIndexerCut={plannedIndexerCut}
              plannedPeriod={plannedPeriod}
              searchTerm={normalizedSearchTerm}
            />
          ))}
        {isDelegators &&
          (isLite ? (
            <DelegatorsLite searchTerm={normalizedSearchTerm} />
          ) : (
            <Delegators searchTerm={normalizedSearchTerm} />
          ))}
        {isCurators &&
          (isLite ? (
            <CuratorsLite searchTerm={normalizedSearchTerm} />
          ) : (
            <Curators searchTerm={normalizedSearchTerm} />
          ))}
        {isSubgraphs && <Subgraphs searchTerm={normalizedSearchTerm} />}
      </TabContent>
    </>
  );
});
