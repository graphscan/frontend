import { useEffect, MouseEvent } from "react";
import ReactTooltip from "react-tooltip";
import { shouldBeRounded, formatTooltipNumber } from "./number.utils";

export const useTooltip = () => {
  useEffect(() => {
    ReactTooltip.rebuild();
  });
};

export const tooltipNumberContent = (value: number) =>
  shouldBeRounded(value) || (Math.abs(value) < 1 && Math.abs(value) > 0)
    ? formatTooltipNumber(value)
    : null;

export const handleTooltipLinkClick = (e: MouseEvent) => {
  e.preventDefault();
  ReactTooltip.hide();
};
