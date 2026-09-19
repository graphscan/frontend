export const HISTORIC_APY_PERIODS = [30, 60, 180, 360] as const;
export type HistoricApyPeriod = (typeof HISTORIC_APY_PERIODS)[number];
export const SECONDS_PER_DAY = 86400;

export type DelegationRateSnapshot = {
  dayEnd: string;
  delegationExchangeRate: string;
  delegatedTokens: string;
  delegatedThawingTokens: string;
  delegatorShares: string;
};

export type IndexerRateHistory = {
  id: string;
  provisions: { id: string }[];
  end: DelegationRateSnapshot[];
  days30: DelegationRateSnapshot[];
  days60: DelegationRateSnapshot[];
  days180: DelegationRateSnapshot[];
  days360: DelegationRateSnapshot[];
  lastEmpty: { dayEnd: string }[];
};

export type HistoricApy = {
  // Exclusive UTC boundary: the incomplete current day is not included.
  endTimestamp: number;
  periods: Record<HistoricApyPeriod, number | null>;
};

const getActiveShareRate = (snapshot?: DelegationRateSnapshot) => {
  if (!snapshot) return null;
  try {
    const tokens = BigInt(snapshot.delegatedTokens);
    const thawing = BigInt(snapshot.delegatedThawingTokens);
    const shares = BigInt(snapshot.delegatorShares);
    if (tokens < 0n || thawing < 0n || thawing > tokens || shares <= 0n)
      return null;
    // Subtract in wei before converting, including at the historical boundary.
    const rate = Number(tokens - thawing) / Number(shares);
    const reported = Number(snapshot.delegationExchangeRate);
    // Reject inconsistent source snapshots rather than publishing a false APY.
    if (
      !Number.isFinite(rate) ||
      !Number.isFinite(reported) ||
      reported < 0 ||
      Math.abs(rate - reported) > Math.max(1e-18, rate * 1e-12)
    )
      return null;
    return rate;
  } catch {
    return null;
  }
};

/** Annual compounded return of a continuously held delegation share. */
export const getHistoricApy = (
  rateEnd: number,
  rateStart: number,
  periodDays: number,
): number | null => {
  if (
    !Number.isFinite(rateEnd) ||
    !Number.isFinite(rateStart) ||
    !Number.isFinite(periodDays) ||
    rateEnd < 0 ||
    rateStart <= 0 ||
    periodDays <= 0
  )
    return null;
  const ratio = rateEnd / rateStart;
  // Avoid displaying -0.0% from floating-point noise on an unchanged share.
  if (Math.abs(ratio - 1) <= Number.EPSILON * 4) return 0;
  const apy = Math.expm1(Math.log(ratio) * (365 / periodDays));
  return Number.isFinite(apy) ? apy : null;
};

export const calculateHistoricApys = (
  history: IndexerRateHistory,
  endTimestamp: number,
): HistoricApy => {
  const end = history.end[0];
  const endRate = getActiveShareRate(end);
  const periods = {} as HistoricApy["periods"];
  for (const days of HISTORIC_APY_PERIODS) {
    const startTimestamp = endTimestamp - days * SECONDS_PER_DAY;
    const start = history[`days${days}`][0];
    const startRate = getActiveShareRate(start);
    // Indexer shares from different Horizon services cannot be combined into a
    // single exchange rate. Neither can histories separated by an empty pool.
    const comparable =
      history.provisions.length <= 1 &&
      start &&
      end &&
      Number(start.dayEnd) <= startTimestamp &&
      Number(end.dayEnd) <= endTimestamp &&
      !history.lastEmpty.some((empty) => Number(empty.dayEnd) > startTimestamp);
    periods[days] =
      comparable && startRate !== null && endRate !== null
        ? getHistoricApy(endRate, startRate, days)
        : null;
  }
  return { endTimestamp, periods };
};
