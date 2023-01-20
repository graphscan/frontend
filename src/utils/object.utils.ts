export const isKey = <T>(key: PropertyKey, object: T): key is keyof T => {
  return key in object;
};
