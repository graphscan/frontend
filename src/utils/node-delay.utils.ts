export const NODE_DELAY_POLL_INTERVAL_MS = 30_000;
export const DEFAULT_ACCEPTABLE_DELAY_SECONDS = 120;

export type NodeDelay = {
  delaySeconds: number;
  observedAt: number;
  delayedSince: number | null;
  isDelayed: boolean;
};

export const getDelayThresholdSeconds = (value?: string) => {
  const seconds = Number(value);
  return Number.isFinite(seconds) && seconds > 0
    ? seconds
    : DEFAULT_ACCEPTABLE_DELAY_SECONDS;
};

export const updateNodeDelay = (
  delaySeconds: number,
  previous: NodeDelay | undefined,
  thresholdSeconds: number,
  observedAt: number,
): NodeDelay => {
  // Old observations (for example, from a background tab) do not confirm
  // that the delay persisted. Allow one missed polling interval.
  const isRecent =
    previous &&
    observedAt >= previous.observedAt &&
    observedAt - previous.observedAt <= NODE_DELAY_POLL_INTERVAL_MS * 2;
  const delayedSince =
    delaySeconds > thresholdSeconds
      ? ((isRecent ? previous.delayedSince : null) ?? observedAt)
      : null;

  return {
    delaySeconds,
    observedAt,
    delayedSince,
    isDelayed:
      delayedSince !== null &&
      observedAt - delayedSince >= NODE_DELAY_POLL_INTERVAL_MS,
  };
};

export const formatNodeDelay = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return (
    [minutes ? `${minutes} min` : null, remainder ? `${remainder} sec` : null]
      .filter(Boolean)
      .join(" ") || "0 sec"
  );
};
