import { useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Fieldset, Legend } from './profile-tabs.styled';
import { DelegatorDetails } from './components/delegator-details/delegator-details.component';
import { DelegatorDetailsLite } from './components/delegator-details-lite/delegator-details-lite.component';
import { DelegatorDelegations } from './components/delegator-delegations/delegator-delegations.component';
import { DelegatorDelegationsLite } from './components/delegator-delegations-lite/delegator-delegations-lite.component';
import { DelegatorCharts } from './components/delegator-charts/delegator-charts.component';
import { IndexerDetails } from './components/indexer-details/indexer-details.component';
import { IndexerDetailsLite } from './components/indexer-details-lite/indexer-details-lite.component';
import { IndexerDelegators } from './components/indexer-delegators/indexer-delegators.component';
import { IndexerDelegatorsLite } from './components/indexer-delegators-lite/indexer-delegators-lite.component';
import { IndexerAllocations } from './components/indexer-allocations/indexer-allocations.component';
import { IndexerCharts } from './components/indexer-charts/indexer-charts.component';
import { CuratorDetails } from './components/curator-details/curator-details.component';
import { CuratorDetailsLite } from './components/curator-details-lite/curator-details-lite.component';
import { CuratorSubgraphs } from './components/curator-subgraphs/curator-subgraphs.component';
import { CuratorSubgraphsLite } from './components/curator-subgraphs-lite/curator-subgraphs-lite.component';
import { SubgraphOwnerSubgraphs } from './components/subgraph-owner-subgraphs/subgraph-owner-subgraphs.component';
import { Tabs, TabButton, TabContent } from '../../../common/tabs/tabs.styled';
import { Footer } from '../../../common/footer/footer.component';
import { isCurrentTab } from '../../../../utils/tabs.utils';

const tabs = {
  delegatorDetails: 'delegator-details',
  delegatorDelegations: 'delegator-delegations',
  delegatorCharts: 'delegator-charts',
  indexerDetails: 'indexer-details',
  indexerDelegators: 'indexer-delegators',
  indexerAllocations: 'indexer-allocations',
  indexerCharts: 'indexer-charts',
  curatorDetails: 'curator-details',
  curatorSubgraphs: 'curator-subgraphs',
  subgraphOwnerSubgraphs: 'subgraph-owner-subgraphs',
};

type TabKey = keyof typeof tabs;

type Props = {
  id: string;
  isLite: boolean;
  isDelegator: boolean;
  isCurator: boolean;
  isIndexer: boolean;
  isSubgraphOwner: boolean;
};

export const ProfileTabs: React.FC<Props> = ({
  id,
  isLite,
  isDelegator,
  isCurator,
  isIndexer,
  isSubgraphOwner,
}) => {
  const { pathname, asPath, replace } = useRouter();
  const href = useMemo(() => ({ pathname, query: { id } }), [id, pathname]);
  const createAsPath = useCallback(
    (tabKey?: TabKey) => `${pathname}?id=${id}${tabKey ? `#${tabs[tabKey]}` : ''}`,
    [id, pathname],
  );
  const replaceWithAsPath = useCallback((tab?: TabKey) => replace(href, createAsPath(tab)), [
    createAsPath,
    href,
    replace,
  ]);

  useEffect(() => {
    if (isDelegator || isCurator || isIndexer || isSubgraphOwner) {
      if (!asPath.match(/#([a-z0-9]+)/i)) {
        if (isDelegator) {
          replaceWithAsPath('delegatorDetails');
          return;
        }

        if (isIndexer) {
          replaceWithAsPath('indexerDetails');
          return;
        }

        if (isCurator) {
          replaceWithAsPath('curatorDetails');
          return;
        }

        if (isSubgraphOwner) {
          replaceWithAsPath('subgraphOwnerSubgraphs');
          return;
        }
      }

      if (!isDelegator && asPath.includes('#delegator-')) {
        replaceWithAsPath(
          isIndexer ? 'indexerDetails' : isCurator ? 'curatorDetails' : 'subgraphOwnerSubgraphs',
        );
        return;
      }

      if (!isIndexer && asPath.includes('#indexer-')) {
        replaceWithAsPath(
          isDelegator ? 'delegatorDetails' : isCurator ? 'curatorDetails' : 'subgraphOwnerSubgraphs',
        );
        return;
      }

      if (!isCurator && asPath.includes('#curator-')) {
        replaceWithAsPath(
          isIndexer ? 'indexerDetails' : isDelegator ? 'delegatorDetails' : 'subgraphOwnerSubgraphs',
        );
        return;
      }

      if (!isSubgraphOwner && asPath.includes('#subgraph-owner-')) {
        replaceWithAsPath(isIndexer ? 'indexerDetails' : isDelegator ? 'delegatorDetails' : 'curatorDetails');
        return;
      }
    } else if (asPath.match(/#([a-z0-9]+)/i)) {
      replaceWithAsPath();
      return;
    }
  }, [asPath, isCurator, isDelegator, isIndexer, isSubgraphOwner, replaceWithAsPath]);

  const isCurrentProfileTab = isCurrentTab(tabs, asPath);
  const isDelegatorDetails = isCurrentProfileTab('delegatorDetails');
  const isDelegatorDelegations = isCurrentProfileTab('delegatorDelegations');
  const isDelegatorCharts = isCurrentProfileTab('delegatorCharts');
  const isIndexerDetails = isCurrentProfileTab('indexerDetails');
  const isIndexerDelegators = isCurrentProfileTab('indexerDelegators');
  const isIndexerAllocations = isCurrentProfileTab('indexerAllocations');
  const isIndexerCharts = isCurrentProfileTab('indexerCharts');
  const isCuratorDetails = isCurrentProfileTab('curatorDetails');
  const isCuratorSubgraphs = isCurrentProfileTab('curatorSubgraphs');
  const isSubgraphOwnerSubgraphs = isCurrentProfileTab('subgraphOwnerSubgraphs');

  return isDelegator || isIndexer || isCurator || isSubgraphOwner ? (
    <>
      <Tabs>
        {isDelegator && (
          <Fieldset role="presentation">
            <Legend>Delegator:</Legend>
            <Link href={href} as={createAsPath('delegatorDetails')} passHref>
              <TabButton active={isDelegatorDetails}>Details</TabButton>
            </Link>
            <Link href={href} as={createAsPath('delegatorDelegations')} passHref>
              <TabButton active={isDelegatorDelegations}>Delegations</TabButton>
            </Link>
            {!isLite && (
              <Link href={href} as={createAsPath('delegatorCharts')} passHref>
                <TabButton active={isDelegatorCharts}>Charts</TabButton>
              </Link>
            )}
          </Fieldset>
        )}
        {isIndexer && (
          <Fieldset role="presentation">
            <Legend>Indexer:</Legend>
            <Link href={href} as={createAsPath('indexerDetails')} passHref>
              <TabButton active={isIndexerDetails}>Details</TabButton>
            </Link>
            <Link href={href} as={createAsPath('indexerDelegators')} passHref>
              <TabButton active={isIndexerDelegators}>Delegators</TabButton>
            </Link>
            <Link href={href} as={createAsPath('indexerAllocations')} passHref>
              <TabButton active={isIndexerAllocations}>Allocations</TabButton>
            </Link>
            {!isLite && (
              <Link href={href} as={createAsPath('indexerCharts')} passHref>
                <TabButton active={isIndexerCharts}>Charts</TabButton>
              </Link>
            )}
          </Fieldset>
        )}
        {isCurator && (
          <Fieldset role="presentation">
            <Legend>Curator:</Legend>
            <Link href={href} as={createAsPath('curatorDetails')} passHref>
              <TabButton active={isCuratorDetails}>Details</TabButton>
            </Link>
            <Link href={href} as={createAsPath('curatorSubgraphs')} passHref>
              <TabButton active={isCuratorSubgraphs}>Subgraphs</TabButton>
            </Link>
          </Fieldset>
        )}
        {isSubgraphOwner && (
          <Fieldset role="presentation">
            <Legend>Subgraph Owner:</Legend>
            <Link href={href} as={createAsPath('subgraphOwnerSubgraphs')} passHref>
              <TabButton active={isSubgraphOwnerSubgraphs}>Subgraphs</TabButton>
            </Link>
          </Fieldset>
        )}
      </Tabs>
      <TabContent footerPressedToBottom={isDelegatorDetails || isIndexerDetails || isCuratorDetails}>
        {isDelegator &&
          isDelegatorDetails &&
          (isLite ? <DelegatorDetailsLite id={id} /> : <DelegatorDetails id={id} />)}
        {isDelegator &&
          isDelegatorDelegations &&
          (isLite ? <DelegatorDelegationsLite id={id} /> : <DelegatorDelegations id={id} />)}
        {!isLite && isDelegator && isDelegatorCharts && <DelegatorCharts id={id} />}
        {isIndexer &&
          isIndexerDetails &&
          (isLite ? <IndexerDetailsLite id={id} /> : <IndexerDetails id={id} />)}
        {isIndexer &&
          isIndexerDelegators &&
          (isLite ? <IndexerDelegatorsLite id={id} /> : <IndexerDelegators id={id} />)}
        {isIndexer && isIndexerAllocations && <IndexerAllocations id={id} isLite={isLite} />}
        {!isLite && isIndexer && isIndexerCharts && <IndexerCharts id={id} />}
        {isCurator &&
          isCuratorDetails &&
          (isLite ? <CuratorDetailsLite id={id} /> : <CuratorDetails id={id} />)}
        {isCurator &&
          isCuratorSubgraphs &&
          (isLite ? <CuratorSubgraphsLite id={id} /> : <CuratorSubgraphs id={id} />)}
        {isSubgraphOwner && isSubgraphOwnerSubgraphs && <SubgraphOwnerSubgraphs id={id} />}
      </TabContent>
    </>
  ) : (
    <TabContent footerPressedToBottom>
      <section />
      <Footer />
    </TabContent>
  );
};
