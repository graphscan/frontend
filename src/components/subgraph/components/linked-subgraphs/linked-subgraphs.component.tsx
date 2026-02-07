import { useCallback, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { compose } from "ramda";
import {
  columns,
  columnsWidth,
  transformToCsvRow,
} from "./linked-subgraphs.model";
import { Table } from "../../../common/table/table.component";
import { LinkedSubgraphsRow } from "../../../../model/linked-subgraphs.model";
import { TableViewModel } from "../../../../model/table.model";
import { downloadCsv } from "../../../../utils/csv.utils";
import { sortRows } from "../../../../utils/table.utils";

type Props = {
  id: string;
  data: Array<LinkedSubgraphsRow>;
};

export const LinkedSubgraphs: React.FC<Props> = observer(({ id, data }) => {
  const [
    {
      currentPage,
      perPage,
      perPageOptions,
      sortParams,
      setCurrentPage,
      setPerPage,
      setSortParams,
    },
  ] = useState(
    () =>
      new TableViewModel<LinkedSubgraphsRow>(
        "linked-subgraphs",
        {
          orderBy: "displayName",
          orderDirection: "asc",
        },
        id,
      ),
  );

  const rows = useMemo(
    () =>
      compose(
        (xs: Array<LinkedSubgraphsRow>) =>
          xs.slice(perPage * (currentPage - 1), perPage * currentPage),
        sortRows(sortParams),
      )(data),
    [currentPage, data, perPage, sortParams],
  );

  const handleCsvDownload = useCallback(() => {
    downloadCsv(
      sortRows(sortParams)(data).map(transformToCsvRow),
      "linked-subgraphs",
    );
  }, [data, sortParams]);

  return (
    <Table<LinkedSubgraphsRow>
      columns={columns}
      rows={rows}
      columnsWidth={columnsWidth}
      downloadCsvOptions={{
        onDownload: handleCsvDownload,
      }}
      paginationOptions={{
        currentPage,
        perPage,
        perPageOptions,
        total: rows.length,
        setCurrentPage,
        setPerPage,
      }}
      sortingOptions={{
        sortParams,
        setSortParams,
      }}
    />
  );
});
