import { makeAutoObservable } from 'mobx';
import { HISTORY_APY_REQUEST_TIME_STORAGE_KEY } from '../../../../model/indexers.model';
import { removeExtraSpaces } from '../../../../utils/text.utils';

export const tabs = {
  indexers: 'indexers',
  delegators: 'delegators',
  curators: 'curators',
  subgraphs: 'subgraphs',
} as const;

type HomeTabName = typeof tabs[keyof typeof tabs];

export const isHomeTabName = (name: string): name is HomeTabName => {
  return Object.values(tabs).some((tabName) => tabName === name);
};

const tabNameToPlaceholder: Record<HomeTabName, string> = {
  indexers: 'Enter indexer id or name',
  delegators: 'Enter delegator id',
  curators: 'Enter curator id',
  subgraphs: 'Enter subgraph id / deployment id / name',
};

class HomeTabsViewModel {
  activeTab: HomeTabName = 'indexers';
  plannedDelegation = '10000';
  plannedIndexerCut = '';
  plannedPeriod = '60';
  shouldCalculateIndexerCut = false;
  private searchTerms: Record<HomeTabName, string> = {
    indexers: '',
    delegators: '',
    curators: '',
    subgraphs: '',
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
    return removeExtraSpaces(this.searchTerms[this.activeTab]).replaceAll('.', '\\.').toLowerCase();
  }

  setActiveTab(activeTab: HomeTabName) {
    this.activeTab = activeTab;
  }

  setSearchTerm(searchTerm: string) {
    this.searchTerms[this.activeTab] = searchTerm;
  }

  setPlannedDelegation(plannedDelegation: string) {
    this.plannedDelegation = plannedDelegation;
  }

  setPlannedIndexerCut(plannedIndexerCut: string) {
    this.plannedIndexerCut = plannedIndexerCut;
  }

  setPlannedPeriod(plannedPeriod: string) {
    sessionStorage.setItem(HISTORY_APY_REQUEST_TIME_STORAGE_KEY, String(Date.now()));
    this.plannedPeriod = plannedPeriod;
  }

  setShouldCalculateIndexerCut(shouldCalculateIndexerCut: boolean) {
    this.shouldCalculateIndexerCut = shouldCalculateIndexerCut;
  }
}

export const homeTabsViewModel = new HomeTabsViewModel();
