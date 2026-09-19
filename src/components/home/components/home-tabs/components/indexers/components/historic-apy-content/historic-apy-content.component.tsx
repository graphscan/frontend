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
        </article>,
      )}
    >
      {value === null ? "—" : formatNumberToPercent(value)}
    </span>
  );
};
