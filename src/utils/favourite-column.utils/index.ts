import { useState, useMemo, useEffect, useCallback, ChangeEvent } from "react";
import { sort } from "ramda";
import { ColumnType } from "antd/es/table";
import { Checkbox } from "./components/checkbox/checkbox.component";
import { comparator } from "./comparator.utils";
import { SortParams } from "../../model/sort.model";

type Params<T> = {
  initialColumns: Array<ColumnType<T>>;
  defaultFavourites?: Record<string, number>;
  favouriteStorageKey: string;
};

export const useFavouriteColumn = <T extends { id: string }>({
  defaultFavourites,
  favouriteStorageKey,
  initialColumns,
}: Params<T>) => {
  const initialFavourites = useMemo(
    () => new Map(Object.entries(defaultFavourites ?? {})),
    [defaultFavourites],
  );

  const [favourites, setFavourites] = useState(initialFavourites);
  const [isFavouritesFixed, setIsFavouritesFixed] = useState(true);

  useEffect(() => {
    const favs = localStorage.getItem(favouriteStorageKey);
    if (favs) {
      try {
        setFavourites(new Map(JSON.parse(favs)));
      } catch {
        localStorage.removeItem(favouriteStorageKey);
      }
    }
  }, [favouriteStorageKey]);

  const handleSetFavourite = useCallback(
    (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setFavourites((prevState) => {
        e.target.checked ? prevState.set(id, Date.now()) : prevState.delete(id);

        if (typeof localStorage !== "undefined") {
          localStorage.setItem(
            favouriteStorageKey,
            JSON.stringify(Array.from(prevState)),
          );
        }

        return new Map(prevState);
      });
    },
    [favouriteStorageKey],
  );

  const handleSetIsFavouritesFixed = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setIsFavouritesFixed(e.target.checked);
    },
    [],
  );

  const columns = useMemo(
    () => [
      {
        title: Checkbox({
          checked: isFavouritesFixed,
          onChange: handleSetIsFavouritesFixed,
        }),
        dataIndex: "favourite",
        key: "favourite",
        render: (isFavourite: boolean, row: T) =>
          Checkbox({
            checked: isFavourite,
            onChange: handleSetFavourite(row.id),
          }),
      },
      ...initialColumns,
    ],
    [
      handleSetFavourite,
      handleSetIsFavouritesFixed,
      initialColumns,
      isFavouritesFixed,
    ],
  );

  const sortFavouriteRows = useCallback(
    <T extends { id: string; favourite: boolean }>(sortParams: SortParams<T>) =>
      sort(
        comparator({
          sortParams,
          favourites,
          isFavouritesFixed,
        }),
      ),
    [favourites, isFavouritesFixed],
  );

  return {
    favourites,
    columns,
    sortFavouriteRows,
  };
};
