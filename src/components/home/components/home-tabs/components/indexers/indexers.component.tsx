import { useCallback, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { compose, prop, tap, map } from "ramda";
import {
  IndexersRow,
  columnsWidth,
  createColumns,
  transformToRows,
  transformToCsvRow,
} from "./indexers.model";
import { useIndexers } from "./indexers.service";
import { HistoricApyContent } from "./components/historic-apy-content/historic-apy-content.component";
import { IdContent } from "./components/id-content/id-content.component";
import { Empty } from "../../../../../common/empty/empty.component";
import { TabPreloader } from "../../../../../common/tab-preloader/tab-preloader.component";
import { Table } from "../../../../../common/table/table.component";
import { TableViewModel } from "../../../../../../model/table.model";
import { useEnsAccounts } from "../../../../../../services/ens.service";
import { downloadCsv } from "../../../../../../utils/csv.utils";
import { useFavouriteColumn } from "../../../../../../utils/favourite-column.utils";
import { ColumnType } from "antd/es/table";

const renderHistoricApy = (_: number, row: IndexersRow) => {
  const { historicApy, id } = row;

  return <HistoricApyContent indexerId={id} value={historicApy} />;
};

const renderIndexerId = (id: string, row: IndexersRow) => {
  return <IdContent indexerId={id} row={row} />;
};

type Props = {
  searchTerm: string;
};

export const Indexers: React.FC<Props> = observer(({ searchTerm }) => {
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
      new TableViewModel<IndexersRow>("indexers", {
        orderBy: "allocatedTokens",
        orderDirection: "desc",
      }),
  );

  const { data: indexersData, error, isLoading, isRefetching } = useIndexers();

  const { data: ens } = useEnsAccounts(
    indexersData?.indexers
      .filter((indexer) => !indexer.defaultDisplayName)
      .map((indexer) => indexer.id),
  );

  const data = useMemo(() => {
    if (ens && indexersData) {
      const { indexers, networkStats } = indexersData;

      return {
        indexers: indexers.map((indexer) => {
          const { id } = indexer;

          if (id in ens) {
            const newIndexer = { ...indexer };
            newIndexer.defaultDisplayName = ens[id];

            return newIndexer;
          }

          return indexer;
        }),
        networkStats,
      };
    }

    return indexersData;
  }, [ens, indexersData]);

  const { favourites, sortFavouriteRows, columns } = useFavouriteColumn({
    initialColumns: createColumns({ renderHistoricApy, renderIndexerId }),
    favouriteStorageKey: "indexers-favourites",
  });

  const rows = useMemo(
    () =>
      data
        ? compose(
            (rows: Array<IndexersRow>) =>
              rows.slice(perPage * (currentPage - 1), perPage * currentPage),
            sortFavouriteRows(sortParams),
            tap(compose(setTotal, prop("length"))),
            (rows) => {
              const regexp = RegExp(searchTerm, "i");
              const filtered = rows.filter((row) =>
                (["id", "name"] as const).some((key) =>
                  row[key]?.match(regexp),
                ),
              );

              if (currentPage !== 1 && total !== filtered.length) {
                setCurrentPage(1);
              }

              return filtered;
            },
            transformToRows({
              favourites,
            }),
          )(data)
        : [],
    [
      currentPage,
      data,
      favourites,
      perPage,
      searchTerm,
      setCurrentPage,
      setTotal,
      sortFavouriteRows,
      sortParams,
      total,
    ],
  );

  const handleCsvDownload = useCallback(() => {
    if (data) {
      downloadCsv(
        compose(
          map(transformToCsvRow),
          sortFavouriteRows(sortParams),
          transformToRows({
            favourites,
          }),
        )(data),
        "indexers",
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
    <Table<IndexersRow>
      columns={columns as ColumnType<IndexersRow>[]}
      rows={rows}
      columnsWidth={columnsWidth}
      isUpdating={isRefetching}
      downloadCsvOptions={{
        onDownload: handleCsvDownload,
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
