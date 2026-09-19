import { renderToStaticMarkup } from "react-dom/server";
import {
  HistoricApy,
  HISTORIC_APY_PERIODS,
} from "../../../../../../../../utils/historic-apy.utils";
import { formatNumberToPercent } from "../../../../../../../../utils/number.utils";

export const HistoricApyContent: React.FC<{ history: HistoricApy | null }> = ({
  history,
}) => {
  const value = history?.periods[60] ?? null;
  return (
    <span
      data-html
      data-tip={renderToStaticMarkup(
        <article>
          {HISTORIC_APY_PERIODS.map((days) => {
            const apy = history?.periods[days] ?? null;
            return (
              <p key={days}>
                {days} days —{" "}
                {apy === null ? "—" : formatNumberToPercent(apy, 2)}
              </p>
            );
          })}
          {history && (
            <p>
              Completed UTC days, ending before{" "}
              {new Date(history.endTimestamp * 1000).toISOString().slice(0, 10)}
              .
            </p>
          )}
          <p>
            Includes reinvested indexing rewards and query fees; excludes
            thawing tokens.
          </p>
          <p>A dash means comparable pool history is unavailable.</p>
        </article>,
      )}
    >
      {value === null ? "—" : formatNumberToPercent(value)}
    </span>
  );
};
