export type PerPageOptions = Array<{ value: number; checked: boolean }>;

export type PaginationOptions = {
  total: number;
  currentPage: number;
  perPage: number;
  perPageOptions: PerPageOptions;
  setCurrentPage: (currentPage: number) => void;
  setPerPage: (perPage: number) => void;
};

export const DEFAULT_PER_PAGE_OPTIONS: PerPageOptions = [
  { value: 15, checked: true },
  { value: 50, checked: false },
  { value: 100, checked: false },
];
