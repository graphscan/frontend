import { useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { isProfileTabName, profileTabsViewModel } from "./profile-tabs.model";
import { Fieldset, Legend } from "./profile-tabs.styled";
import { DelegatorDetails } from "./components/delegator-details/delegator-details.component";
import { DelegatorDelegations } from "./components/delegator-delegations/delegator-delegations.component";
import { IndexerDetails } from "./components/indexer-details/indexer-details.component";
import { IndexerDelegators } from "./components/indexer-delegators/indexer-delegators.component";
import { IndexerAllocations } from "./components/indexer-allocations/indexer-allocations.component";
import { IndexerCharts } from "./components/indexer-charts/indexer-charts.component";
import { CuratorDetails } from "./components/curator-details/curator-details.component";
import { CuratorSubgraphs } from "./components/curator-subgraphs/curator-subgraphs.component";
import { CuratorActions } from "./components/curator-actions/curator-actions.component";
import { SubgraphOwnerSubgraphs } from "./components/subgraph-owner-subgraphs/subgraph-owner-subgraphs.component";
import { Tabs, TabButton, TabContent } from "../../../common/tabs/tabs.styled";
import { Footer } from "../../../common/footer/footer.component";
import { isCurrentTab } from "../../../../utils/tabs.utils";

const tabs = {
  delegatorDetails: "delegator-details",
  delegatorDelegations: "delegator-delegations",
  indexerDetails: "indexer-details",
  indexerDelegators: "indexer-delegators",
  indexerAllocations: "indexer-allocations",
  indexerCharts: "indexer-charts",
  curatorDetails: "curator-details",
  curatorSubgraphs: "curator-subgraphs",
  curatorActions: "curator-actions",
  subgraphOwnerSubgraphs: "subgraph-owner-subgraphs",
};

type TabKey = keyof typeof tabs;

type Props = {
  id: string;
  isDelegator: boolean;
  isCurator: boolean;
  isIndexer: boolean;
  isSubgraphOwner: boolean;
};

export const ProfileTabs: React.FC<Props> = ({
  id,
  isDelegator,
  isCurator,
  isIndexer,
  isSubgraphOwner,
}) => {
  const { pathname, asPath, replace } = useRouter();
  const href = useMemo(() => ({ pathname, query: { id } }), [id, pathname]);
  const createAsPath = useCallback(
    (tabKey?: TabKey) =>
      `${pathname}?id=${id}${tabKey ? `#${tabs[tabKey]}` : ""}`,
    [id, pathname],
  );
  const replaceWithAsPath = useCallback(
    (tab?: TabKey) => replace(href, createAsPath(tab)),
    [createAsPath, href, replace],
  );

  useEffect(() => {
    const tabName = asPath.split("#")[1];

    if (isProfileTabName(tabName)) {
      profileTabsViewModel.setActiveTab(tabName);
    }
  }, [asPath]);

  useEffect(() => {
    if (isDelegator || isCurator || isIndexer || isSubgraphOwner) {
      if (!asPath.match(/#([a-z0-9]+)/i)) {
        if (isDelegator) {
          replaceWithAsPath("delegatorDetails");
          return;
        }

        if (isIndexer) {
          replaceWithAsPath("indexerDetails");
          return;
        }

        if (isCurator) {
          replaceWithAsPath("curatorDetails");
          return;
        }

        if (isSubgraphOwner) {
          replaceWithAsPath("subgraphOwnerSubgraphs");
          return;
        }
      }

      if (!isDelegator && asPath.includes("#delegator-")) {
        replaceWithAsPath(
          isIndexer
            ? "indexerDetails"
            : isCurator
              ? "curatorDetails"
              : "subgraphOwnerSubgraphs",
        );
        return;
      }

      if (!isIndexer && asPath.includes("#indexer-")) {
        replaceWithAsPath(
          isDelegator
            ? "delegatorDetails"
            : isCurator
              ? "curatorDetails"
              : "subgraphOwnerSubgraphs",
        );
        return;
      }

      if (!isCurator && asPath.includes("#curator-")) {
        replaceWithAsPath(
          isIndexer
            ? "indexerDetails"
            : isDelegator
              ? "delegatorDetails"
              : "subgraphOwnerSubgraphs",
        );
        return;
      }

      if (!isSubgraphOwner && asPath.includes("#subgraph-owner-")) {
        replaceWithAsPath(
          isIndexer
            ? "indexerDetails"
            : isDelegator
              ? "delegatorDetails"
              : "curatorDetails",
        );
        return;
      }
    } else if (asPath.match(/#([a-z0-9]+)/i)) {
      replaceWithAsPath();
      return;
    }
  }, [
    asPath,
    isCurator,
    isDelegator,
    isIndexer,
    isSubgraphOwner,
    replaceWithAsPath,
  ]);

  const isCurrentProfileTab = isCurrentTab(tabs, asPath);
  const isDelegatorDetails = isCurrentProfileTab("delegatorDetails");
  const isDelegatorDelegations = isCurrentProfileTab("delegatorDelegations");
  const isIndexerDetails = isCurrentProfileTab("indexerDetails");
  const isIndexerDelegators = isCurrentProfileTab("indexerDelegators");
  const isIndexerAllocations = isCurrentProfileTab("indexerAllocations");
  const isIndexerCharts = isCurrentProfileTab("indexerCharts");
  const isCuratorDetails = isCurrentProfileTab("curatorDetails");
  const isCuratorSubgraphs = isCurrentProfileTab("curatorSubgraphs");
  const isCuratorActions = isCurrentProfileTab("curatorActions");
  const isSubgraphOwnerSubgraphs = isCurrentProfileTab(
    "subgraphOwnerSubgraphs",
  );

  return isDelegator || isIndexer || isCurator || isSubgraphOwner ? (
    <>
      <Tabs>
        {isDelegator && (
          <Fieldset role="presentation">
            <Legend>Delegator:</Legend>
            <Link href={href} as={createAsPath("delegatorDetails")}>
              <TabButton $active={isDelegatorDetails}>Details</TabButton>
            </Link>
            <Link href={href} as={createAsPath("delegatorDelegations")}>
              <TabButton $active={isDelegatorDelegations}>
                Delegations
              </TabButton>
            </Link>
          </Fieldset>
        )}
        {isIndexer && (
          <Fieldset role="presentation">
            <Legend>Indexer:</Legend>
            <Link href={href} as={createAsPath("indexerDetails")}>
              <TabButton $active={isIndexerDetails}>Details</TabButton>
            </Link>
            <Link href={href} as={createAsPath("indexerDelegators")}>
              <TabButton $active={isIndexerDelegators}>Delegators</TabButton>
            </Link>
            <Link href={href} as={createAsPath("indexerAllocations")}>
              <TabButton $active={isIndexerAllocations}>Allocations</TabButton>
            </Link>
            <Link href={href} as={createAsPath("indexerCharts")}>
              <TabButton $active={isIndexerCharts}>Charts</TabButton>
            </Link>
          </Fieldset>
        )}
        {isCurator && (
          <Fieldset role="presentation">
            <Legend>Curator:</Legend>
            <Link href={href} as={createAsPath("curatorDetails")}>
              <TabButton $active={isCuratorDetails}>Details</TabButton>
            </Link>
            <Link href={href} as={createAsPath("curatorSubgraphs")}>
              <TabButton $active={isCuratorSubgraphs}>Subgraphs</TabButton>
            </Link>
            <Link href={href} as={createAsPath("curatorActions")}>
              <TabButton $active={isCuratorActions}>Actions</TabButton>
            </Link>
          </Fieldset>
        )}
        {isSubgraphOwner && (
          <Fieldset role="presentation">
            <Legend>Subgraph Owner:</Legend>
            <Link href={href} as={createAsPath("subgraphOwnerSubgraphs")}>
              <TabButton $active={isSubgraphOwnerSubgraphs}>
                Subgraphs
              </TabButton>
            </Link>
          </Fieldset>
        )}
      </Tabs>
      <TabContent
        $footerPressedToBottom={
          isDelegatorDetails || isIndexerDetails || isCuratorDetails
        }
      >
        {isDelegator && isDelegatorDetails && <DelegatorDetails id={id} />}
        {isDelegator && isDelegatorDelegations && (
          <DelegatorDelegations id={id} />
        )}
        {isIndexer && isIndexerDetails && <IndexerDetails id={id} />}
        {isIndexer && isIndexerDelegators && <IndexerDelegators id={id} />}
        {isIndexer && isIndexerAllocations && <IndexerAllocations id={id} />}
        {isIndexer && isIndexerCharts && <IndexerCharts id={id} />}
        {isCurator && isCuratorDetails && <CuratorDetails id={id} />}
        {isCurator && isCuratorSubgraphs && <CuratorSubgraphs id={id} />}
        {isCurator && isCuratorActions && <CuratorActions id={id} />}
        {isSubgraphOwner && isSubgraphOwnerSubgraphs && (
          <SubgraphOwnerSubgraphs id={id} />
        )}
      </TabContent>
    </>
  ) : (
    <TabContent $footerPressedToBottom>
      <section />
      <Footer />
    </TabContent>
  );
};
