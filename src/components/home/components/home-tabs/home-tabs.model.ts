import { makeAutoObservable } from "mobx";
import { removeExtraSpaces } from "../../../../utils/text.utils";

export const tabs = {
  indexers: "indexers",
  delegators: "delegators",
  curators: "curators",
  subgraphs: "subgraphs",
} as const;

type HomeTabName = (typeof tabs)[keyof typeof tabs];

export const isHomeTabName = (name: string): name is HomeTabName => {
  return Object.values(tabs).some((tabName) => tabName === name);
};

const tabNameToPlaceholder: Record<HomeTabName, string> = {
  indexers: "Enter indexer id or name",
  delegators: "Enter delegator id",
  curators: "Enter curator id",
  subgraphs: "Enter subgraph id / deployment id / name / network",
};

class HomeTabsViewModel {
  activeTab: HomeTabName = "indexers";
  private searchTerms: Record<HomeTabName, string> = {
    indexers: "",
    delegators: "",
    curators: "",
    subgraphs: "",
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get placeholder() {
    return tabNameToPlaceholder[this.activeTab];
  }

  get searchTerm() {
    return this.searchTerms[this.activeTab];
  }

  get normalizedSearchTerm() {
    return removeExtraSpaces(this.searchTerms[this.activeTab])
      .replace(/\./g, "\\.")
      .toLowerCase();
  }

  setActiveTab(activeTab: HomeTabName) {
    this.activeTab = activeTab;
  }

  setSearchTerm(searchTerm: string) {
    this.searchTerms[this.activeTab] = searchTerm;
  }
}

export const homeTabsViewModel = new HomeTabsViewModel();
