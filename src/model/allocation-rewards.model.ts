export type PotentialRewards = {
  potentialIndexerRewards: number;
  potentialDelegatorRewards: number;
};

export type AllocationsRewards = Record<string, PotentialRewards>;

export type IndexerDailyData = {
  dayEnd: number;
  dayStart: number;
  ownStakeRatio: string;
  delegatedTokens: string;
};

/**
 * Find the closest daily data entry at or before a given timestamp.
 * Expects dailyData sorted by dayEnd descending.
 */
export const findDailyDataAtClose = (
  dailyData: Array<IndexerDailyData>,
  closedAt: number,
): IndexerDailyData | undefined =>
  dailyData.find((d) => d.dayEnd <= closedAt);
