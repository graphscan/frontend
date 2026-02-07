export const isKey = <T extends Record<string, unknown>>(
  key: PropertyKey,
  object: T,
): key is keyof T => key in object;
