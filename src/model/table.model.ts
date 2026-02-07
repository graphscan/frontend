import { makeObservable, observable, computed, action, toJS } from "mobx";
import { SortParams } from "./sort.model";
import { DEFAULT_PER_PAGE_OPTIONS } from "./pagination.model";

export class TableViewModel<Row> {
  _currentPage: number;
  _idFilters: Array<string> | null = null;
  _sortParams: SortParams<Row>;
  _total = 0;
  perPageOptions: Array<{ value: number; checked: boolean }>;
  storageManager: TableStorageManager<Row>;

  constructor(
    tableName: string,
    sortParams: SortParams<Row>,
    id?: string,
    perPageOptions?: Array<{ value: number; checked: boolean }>,
  ) {
    makeObservable(this, {
      _currentPage: observable,
      _idFilters: observable,
      _sortParams: observable,
      _total: observable,
      perPageOptions: observable,
      currentPage: computed,
      idFilters: computed,
      perPage: computed,
      sortParams: computed,
      total: computed,
      setCurrentPage: action.bound,
      setIdFilters: action.bound,
      setPerPage: action.bound,
      setSortParams: action.bound,
      setTotal: action.bound,
    });
    this.storageManager = new TableStorageManager(tableName, id);
    this._currentPage = this.storageManager.getStorageCurrentPage() ?? 1;
    this._sortParams = this.storageManager.getStorageSortParams() ?? sortParams;
    this.perPageOptions = perPageOptions ?? DEFAULT_PER_PAGE_OPTIONS;

    const perPage = this.storageManager.getStoragePerPage();
    if (perPage) {
      this.perPageOptions = this.perPageOptions.map((o) => ({
        ...o,
        checked: o.value === perPage,
      }));
    }
  }

  get currentPage() {
    return toJS(this._currentPage);
  }

  get idFilters() {
    return toJS(this._idFilters);
  }

  get perPage() {
    return this.perPageOptions.reduce(
      (acc, val) => (val.checked ? val.value : acc),
      0,
    );
  }

  get sortParams() {
    return toJS(this._sortParams);
  }

  get total() {
    return toJS(this._total);
  }

  setCurrentPage(currentPage: number) {
    this._currentPage = currentPage;
    this.storageManager.setStorageCurrentPage(currentPage);
  }

  setIdFilters(idFilters: Array<string> | null) {
    this._idFilters = idFilters;
  }

  setPerPage(value: number) {
    this.setCurrentPage(1);
    this.perPageOptions = this.perPageOptions.map((o) => ({
      ...o,
      checked: o.value === value,
    }));
    this.storageManager.setStoragePerPage(value);
  }

  setSortParams(orderBy: keyof Row) {
    this.setCurrentPage(1);
    const { orderDirection } = this._sortParams;
    this._sortParams = {
      orderBy,
      orderDirection: orderDirection === "asc" ? "desc" : "asc",
    };
    this.storageManager.setStorageSortParams(this._sortParams);
  }

  setTotal(total: number) {
    this._total = total;
  }
}

class TableStorageManager<Row> {
  private readonly perPageKey: string;
  private readonly sortKey: string;
  private readonly currentPageKey: string;
  private readonly id: string | undefined;

  constructor(tableName: string, id?: string) {
    this.id = id?.toLowerCase();
    this.perPageKey = `${tableName}-per-page`;
    this.currentPageKey = `${tableName}-current-page`;
    this.sortKey = `${tableName}-sort-params`;
  }

  getStoragePerPage = () => {
    const perPage =
      typeof localStorage !== "undefined"
        ? Number(
            localStorage.getItem(
              `${this.perPageKey}${this.id ? `-${this.id}` : ""}`,
            ),
          )
        : null;

    return perPage;
  };

  getStorageCurrentPage = () => {
    const currentPage =
      typeof localStorage !== "undefined"
        ? Number(
            localStorage.getItem(
              `${this.currentPageKey}${this.id ? `-${this.id}` : ""}`,
            ),
          )
        : NaN;

    return currentPage > 0 ? currentPage : null;
  };

  getStorageSortParams = (): SortParams<Row> | null => {
    const sortValue =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(`${this.sortKey}${this.id ? `-${this.id}` : ""}`)
        : null;
    try {
      return sortValue ? JSON.parse(sortValue) : null;
    } catch {
      return null;
    }
  };

  setStoragePerPage = (perPage: number | null) => {
    const key = `${this.perPageKey}${this.id ? `-${this.id}` : ""}`;
    if (perPage) {
      localStorage.setItem(key, String(perPage));
    } else {
      localStorage.removeItem(key);
    }
  };

  setStorageCurrentPage = (currentPage: number) => {
    localStorage.setItem(
      `${this.currentPageKey}${this.id ? `-${this.id}` : ""}`,
      String(currentPage),
    );
  };

  setStorageSortParams = (sortParams: SortParams<Row> | null) => {
    const key = `${this.sortKey}${this.id ? `-${this.id}` : ""}`;
    if (sortParams) {
      localStorage.setItem(key, JSON.stringify(sortParams));
    } else {
      localStorage.removeItem(key);
    }
  };
}
