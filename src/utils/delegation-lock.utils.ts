import { unixTimeToDateString } from "./date.utils";

const formatDate = unixTimeToDateString("MMM dd, yyyy HH:mm");

// Horizon stores Unix timestamps; legacy delegations store epoch numbers.
export const formatLockedUntil = (
  value: number | null,
  isLegacy: boolean,
): string | null => {
  if (!value || value <= 0) return null;
  return isLegacy ? `${value} epoch` : formatDate(value);
};
