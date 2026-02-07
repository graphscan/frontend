import { useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SubgraphDetails } from "./components/subgraph-details/subgraph-details.component";
import { SubgraphCurators } from "./components/subgraph-curators/subgraph-curators.component";
import { SubgraphAllocations } from "./components/subgraph-allocations/subgraph-allocations.component";
import { LinkedSubgraphs } from "../../../linked-subgraphs/linked-subgraphs.component";
import { LinkedSubgraphsRow } from "../../../../../../model/linked-subgraphs.model";
import { isCurrentTab } from "../../../../../../utils/tabs.utils";
import {
  TabButton,
  Tabs,
  TabContent,
} from "../../../../../common/tabs/tabs.styled";

const tabs = {
  subgraphDetails: "subgraph-details",
  subgraphCurators: "subgraph-curators",
  subgraphAllocations: "subgraph-allocations",
  linkedSubgraphs: "linked-subgraphs",
};

type Props = {
  deploymentId: string;
  linkedSubgraphs: Array<LinkedSubgraphsRow> | null;
  linkedSubgraphsIds: Array<string> | null;
  subgraphId: string;
  versionId: string;
};

export const SubgraphTabs: React.FC<Props> = ({
  deploymentId,
  linkedSubgraphs,
  linkedSubgraphsIds,
  subgraphId,
  versionId,
}) => {
  const { pathname, asPath, replace } = useRouter();

  const href = useMemo(
    () => ({ pathname, query: { version: versionId } }),
    [versionId, pathname],
  );
  const createAsPath = useCallback(
    (tab: keyof typeof tabs) => `${pathname}?version=${versionId}#${tabs[tab]}`,
    [versionId, pathname],
  );

  useEffect(() => {
    if (
      !asPath.match(/#([a-z0-9]+)/i) ||
      (!linkedSubgraphs && asPath.includes(`#${tabs.linkedSubgraphs}`))
    ) {
      replace(href, createAsPath("subgraphDetails"));
    }
  }, [asPath, linkedSubgraphs, replace, href, createAsPath]);

  const isCurrentSubgraphTab = isCurrentTab(tabs, asPath);
  const isSubgraphDetails = isCurrentSubgraphTab("subgraphDetails");
  const isSubgraphCurators = isCurrentSubgraphTab("subgraphCurators");
  const isSubgraphAllocations = isCurrentSubgraphTab("subgraphAllocations");
  const isLinkedSubgraphs = isCurrentSubgraphTab("linkedSubgraphs");

  const ids = {
    deploymentId,
    subgraphId,
    versionId,
  };

  return (
    <>
      <Tabs>
        <Link href={href} as={createAsPath("subgraphDetails")}>
          <TabButton $active={isSubgraphDetails}>Details</TabButton>
        </Link>
        <Link href={href} as={createAsPath("subgraphCurators")}>
          <TabButton $active={isSubgraphCurators}>Curators</TabButton>
        </Link>
        <Link href={href} as={createAsPath("subgraphAllocations")}>
          <TabButton $active={isSubgraphAllocations}>Allocations</TabButton>
        </Link>
        {linkedSubgraphsIds && (
          <Link href={href} as={createAsPath("linkedSubgraphs")}>
            <TabButton $active={isLinkedSubgraphs}>Linked Subgraphs</TabButton>
          </Link>
        )}
      </Tabs>
      <TabContent $footerPressedToBottom={isSubgraphDetails}>
        {isSubgraphDetails && <SubgraphDetails {...ids} />}
        {isSubgraphCurators && (
          <SubgraphCurators
            ids={[subgraphId, ...(linkedSubgraphsIds ?? [])]}
            deploymentId={deploymentId}
          />
        )}
        {isSubgraphAllocations && <SubgraphAllocations id={versionId} />}
        {linkedSubgraphs && isLinkedSubgraphs && (
          <LinkedSubgraphs id={subgraphId} data={linkedSubgraphs} />
        )}
      </TabContent>
    </>
  );
};
