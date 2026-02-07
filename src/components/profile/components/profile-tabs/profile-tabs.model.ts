import { makeAutoObservable } from "mobx";

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
} as const;

type ProfileTabName = (typeof tabs)[keyof typeof tabs];

export const isProfileTabName = (name: string): name is ProfileTabName => {
  return Object.values(tabs).some((tabName) => tabName === name);
};

class ProfileTabsViewModel {
  activeTab: ProfileTabName | undefined = undefined;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get currentAccountType() {
    if (this.activeTab?.startsWith("indexer")) {
      return "indexer";
    } else if (this.activeTab?.startsWith("delegator")) {
      return "delegator";
    } else if (this.activeTab?.startsWith("curator")) {
      return "curator";
    } else if (this.activeTab?.startsWith("subgraph-owner")) {
      return "subgraph-owner";
    }
  }

  setActiveTab(activeTab: ProfileTabName) {
    this.activeTab = activeTab;
  }
}

export const profileTabsViewModel = new ProfileTabsViewModel();
