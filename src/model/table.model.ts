import { makeObservable, observable, computed, action, toJS } from "mobx";
import { SortParams } from "./sort.model";
import { DEFAULT_PER_PAGE_OPTIONS } from "./pagination.model";
import {
  readLocalStorage,
  writeLocalStorage,
  removeLocalStorage,
} from "../utils/browser-storage.utils";

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
    if (
      perPage &&
      this.perPageOptions.some((option) => option.value === perPage)
    ) {
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
    return Number(
      readLocalStorage(`${this.perPageKey}${this.id ? `-${this.id}` : ""}`),
    );
  };

  getStorageCurrentPage = () => {
    const currentPage = Number(
      readLocalStorage(`${this.currentPageKey}${this.id ? `-${this.id}` : ""}`),
    );
    return Number.isSafeInteger(currentPage) && currentPage > 0
      ? currentPage
      : null;
  };

  getStorageSortParams = (): SortParams<Row> | null => {
    const sortValue = readLocalStorage(
      `${this.sortKey}${this.id ? `-${this.id}` : ""}`,
    );
    try {
      const value = sortValue ? JSON.parse(sortValue) : null;
      return value &&
        typeof value.orderBy === "string" &&
        (value.orderDirection === "asc" || value.orderDirection === "desc")
        ? value
        : null;
    } catch {
      return null;
    }
  };

  setStoragePerPage = (perPage: number | null) => {
    const key = `${this.perPageKey}${this.id ? `-${this.id}` : ""}`;
    if (perPage) {
      writeLocalStorage(key, String(perPage));
    } else {
      removeLocalStorage(key);
    }
  };

  setStorageCurrentPage = (currentPage: number) => {
    writeLocalStorage(
      `${this.currentPageKey}${this.id ? `-${this.id}` : ""}`,
      String(currentPage),
    );
  };

  setStorageSortParams = (sortParams: SortParams<Row> | null) => {
    const key = `${this.sortKey}${this.id ? `-${this.id}` : ""}`;
    if (sortParams) {
      writeLocalStorage(key, JSON.stringify(sortParams));
    } else {
      removeLocalStorage(key);
    }
  };
}
