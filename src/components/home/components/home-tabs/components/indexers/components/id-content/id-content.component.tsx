import { useMemo } from "react";
import { IndexersRow } from "../../indexers.model";
import { renderAccountId } from "../../../../../../../../utils/table.utils";

type Props = {
  indexerId: string;
  row: IndexersRow;
};

export const IdContent: React.FC<Props> = ({ indexerId, row }) => {
  const id = useMemo(
    () => renderAccountId("indexer-details")(indexerId, row),
    [indexerId, row],
  );

  return id;
};
