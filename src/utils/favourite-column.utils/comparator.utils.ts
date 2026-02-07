import { rowsComparator } from "../table.utils";
import { SortParams } from "../../model/sort.model";

type ComparatorParams<T> = {
  sortParams: SortParams<T>;
  isFavouritesFixed: boolean;
  favourites: Map<string, number>;
};

export const comparator =
  <T extends { id: string; favourite: boolean }>({
    sortParams,
    isFavouritesFixed,
    favourites,
  }: ComparatorParams<T>) =>
  (a: T, b: T) => {
    if (isFavouritesFixed) {
      if (a.favourite && b.favourite) {
        return Number(favourites?.get(a.id)) - Number(favourites?.get(b.id));
      }

      if (b.favourite) {
        return 1;
      }

      if (a.favourite) {
        return -1;
      }
    }

    return rowsComparator(sortParams)(a, b);
  };
