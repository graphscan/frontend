import { useCallback, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { compose, prop, tap, map } from "ramda";
import {
  SubgraphsRow,
  columnsWidth,
  columns as initialColumns,
  transformToRows,
  transformToCsvRow,
} from "./subgraphs.model";
import { useSubgraphs } from "./subgraphs.service";
import { Empty } from "../../../../../common/empty/empty.component";
import { TabPreloader } from "../../../../../common/tab-preloader/tab-preloader.component";
import { Table } from "../../../../../common/table/table.component";
import { bs58encode } from "../../../../../../utils/bs58.utils";
import { downloadCsv } from "../../../../../../utils/csv.utils";
import { useFavouriteColumn } from "../../../../../../utils/favourite-column.utils";
import { TableViewModel } from "../../../../../../model/table.model";
import { ColumnType } from "antd/es/table";

type Props = {
  searchTerm: string;
};

export const Subgraphs: React.FC<Props> = observer(({ searchTerm }) => {
  const [
    {
      currentPage,
      perPage,
      perPageOptions,
      sortParams,
      total,
      storageManager,
      setCurrentPage,
      setPerPage,
      setSortParams,
      setTotal,
    },
  ] = useState(
    () =>
      new TableViewModel<SubgraphsRow>("subgraphs", {
        orderBy: "displayName",
        orderDirection: "asc",
      }),
  );

  const { data, error, isLoading, isRefetching } = useSubgraphs();

  const { favourites, sortFavouriteRows, columns } = useFavouriteColumn({
    initialColumns,
    favouriteStorageKey: "subgraphs-favourites",
  });

  const rows = useMemo(
    () =>
      data
        ? compose(
            (rows: Array<SubgraphsRow>) =>
              rows.slice(perPage * (currentPage - 1), perPage * currentPage),
            sortFavouriteRows(sortParams),
            tap(compose(setTotal, prop("length"))),
            (rows: Array<SubgraphsRow>) => {
              const regexp = RegExp(searchTerm, "i");

              const filtered = rows.filter(
                (row) =>
                  (
                    ["id", "deploymentId", "displayName", "network"] as const
                  ).some((key) => row[key]?.match(regexp)) ||
                  bs58encode(`1220${row.deploymentId.substring(2)}`).match(
                    regexp,
                  ),
              );

              if (currentPage !== 1 && total !== filtered.length) {
                setCurrentPage(1);
              }

              return filtered;
            },
            transformToRows(favourites),
          )(data)
        : [],
    [
      data,
      sortFavouriteRows,
      sortParams,
      setTotal,
      favourites,
      perPage,
      currentPage,
      searchTerm,
      total,
      setCurrentPage,
    ],
  );

  const handleCsvDownload = useCallback(() => {
    if (data) {
      downloadCsv(
        compose(
          map(transformToCsvRow),
          sortFavouriteRows(sortParams),
          transformToRows(favourites),
        )(data),
        "subgraphs",
      );
    }
  }, [data, favourites, sortFavouriteRows, sortParams]);

  if (isLoading) {
    return <TabPreloader />;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    storageManager.setStoragePerPage(null);
    storageManager.setStorageSortParams(null);
    return <Empty />;
  }

  return (
    <Table<SubgraphsRow>
      columns={columns as ColumnType<SubgraphsRow>[]}
      rows={rows}
      columnsWidth={columnsWidth}
      isUpdating={isRefetching}
      downloadCsvOptions={{
        onDownload: handleCsvDownload,
        isLoading: isRefetching,
      }}
      paginationOptions={{
        currentPage,
        perPage,
        perPageOptions,
        total,
        setCurrentPage,
        setPerPage,
      }}
      sortingOptions={{
        sortParams,
        unsortableKeys: ["favourite"],
        setSortParams,
      }}
    />
  );
});
