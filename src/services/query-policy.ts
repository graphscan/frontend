// Keep current network/reward inputs fresh while leaving expensive history on
// its own cadence. React Query pauses interval refetching in background tabs.
export const CURRENT_DATA_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  refetchInterval: 5 * 60 * 1000,
  cacheTime: 15 * 60 * 1000,
};

export const HISTORY_QUERY_OPTIONS = {
  staleTime: 30 * 60 * 1000,
  refetchInterval: 30 * 60 * 1000,
  cacheTime: 60 * 60 * 1000,
};
