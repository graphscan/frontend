import { curry } from "ramda";

export const isCurrentTab = curry(
  <T extends Record<string, unknown>>(
    tabs: T,
    path: string,
    tabName: keyof T,
  ) => RegExp(`#${tabs[tabName]}`, "i").test(path),
);
