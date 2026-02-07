import { useCallback, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { compose, map } from "ramda";
import {
  SubgraphCuratorsRow,
  columnsWidth,
  columns,
  transformToCsvRow,
} from "./subgraph-curators.model";
import { useSubgraphCurators } from "./subgraph-curators.service";
import { Empty } from "../../../../../../../common/empty/empty.component";
import { TabPreloader } from "../../../../../../../common/tab-preloader/tab-preloader.component";
import { Table } from "../../../../../../../common/table/table.component";
import { TableViewModel } from "../../../../../../../../model/table.model";
import { downloadCsv } from "../../../../../../../../utils/csv.utils";
import { sortRows } from "../../../../../../../../utils/table.utils";

type Props = {
  ids: Array<string>;
  deploymentId: string;
};

export const SubgraphCurators: React.FC<Props> = observer(
  ({ ids, deploymentId }) => {
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
        new TableViewModel<SubgraphCuratorsRow>(
          "subgraph-curators",
          {
            orderBy: "signalledTokens",
            orderDirection: "desc",
          },
          [...ids, deploymentId].join("-").toLowerCase(),
        ),
    );

    const { data, error, isFetching, isLoading } = useSubgraphCurators(
      ids,
      deploymentId,
    );

    useEffect(() => {
      if (data) {
        setTotal(data.length);
      }
    }, [data, setTotal]);

    const rows = useMemo(
      () =>
        data
          ? compose(
              (xs: Array<SubgraphCuratorsRow>) =>
                xs.slice(perPage * (currentPage - 1), perPage * currentPage),
              sortRows(sortParams),
            )(data)
          : [],
      [currentPage, data, perPage, sortParams],
    );

    const handleCsvDownload = useCallback(() => {
      if (data) {
        downloadCsv(
          compose(map(transformToCsvRow), sortRows(sortParams))(data),
          "subgraph-curators",
        );
      }
    }, [data, sortParams]);

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
      <Table<SubgraphCuratorsRow>
        columns={columns}
        rows={rows}
        columnsWidth={columnsWidth}
        isUpdating={isFetching}
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
          setSortParams,
        }}
      />
    );
  },
);
