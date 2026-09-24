// Browser storage is optional: privacy settings, quotas and embedded browsers
// can reject even access to the localStorage property itself.
export const readLocalStorage = (key: string): string | null => {
  try {
    return typeof window === "undefined"
      ? null
      : window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const writeLocalStorage = (key: string, value: string): void => {
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  } catch {
    // Keep the current in-memory UI state when persistence is unavailable.
  }
};

export const removeLocalStorage = (key: string): void => {
  try {
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
  } catch {
    // A blocked preference must not prevent the page from rendering.
  }
};
