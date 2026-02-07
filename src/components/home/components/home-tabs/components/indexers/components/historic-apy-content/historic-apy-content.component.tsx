import { useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import styled from "styled-components";
import { useTotalAllocations } from "./historic-apy-content.service";
import {
  TotalAllocation,
  getHistoricApy,
  getHistoricApyPeriod,
} from "../../indexers.model";
import { formatNumberToPercent } from "../../../../../../../../utils/number.utils";
import { Spinner as _Spinner } from "../../../../../../../common/spinner/spinner.component";

const Spinner = styled(_Spinner)`
  width: 20px;
  height: 20px;

  @media (max-width: 1920px) {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 1440px) {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 1280px) {
    width: 14px;
    height: 14px;
  }
`;

const TooltipContent = styled.article`
  .tooltip-content-row {
    display: flex;
    align-items: center;
  }
`;

const toApyPercent = (value: number) => (value * 36500).toFixed(2);

const filterByClosePeriod =
  (periodDays: number) =>
  ({ closedAt }: TotalAllocation) =>
    closedAt >= getHistoricApyPeriod(periodDays);

type Props = {
  indexerId: string;
  value: number;
};

export const HistoricApyContent: React.FC<Props> = ({ indexerId, value }) => {
  const [isHover, setIsHover] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const ref = useRef<HTMLSpanElement>(null);

  const { data } = useTotalAllocations(indexerId, isHover, ref.current);

  const onMouseEnter = () => {
    setTimer(setTimeout(() => setIsHover(true), 1000));
  };

  const onMouseLeave = () => {
    if (timer) {
      clearTimeout(timer);
    }

    setIsHover(false);
  };

  return (
    <span
      ref={ref}
      data-html
      data-tip={renderToStaticMarkup(
        <TooltipContent>
          <p className="tooltip-content-row">
            30 days - &nbsp;
            {data ? (
              `${toApyPercent(getHistoricApy(data.filter(filterByClosePeriod(30)), 30))}%`
            ) : (
              <Spinner />
            )}
          </p>
          <p className="tooltip-content-row">
            60 days -&nbsp;{toApyPercent(value)}%
          </p>
          <p className="tooltip-content-row">
            180 days - &nbsp;
            {data ? (
              `${toApyPercent(getHistoricApy(data.filter(filterByClosePeriod(180)), 180))}%`
            ) : (
              <Spinner />
            )}
          </p>
          <p className="tooltip-content-row">
            360 days -&nbsp;
            {data ? `${toApyPercent(getHistoricApy(data, 360))}%` : <Spinner />}
          </p>
        </TooltipContent>,
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {formatNumberToPercent(value * 365)}
    </span>
  );
};
