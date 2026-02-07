import {
  StyledWalletCell,
  Delta,
  Title,
  Value,
} from "./wallet-card-cell.styled";
import { formatNumber } from "../../../../../../utils/number.utils";
import { tooltipNumberContent } from "../../../../../../utils/tooltip.utils";

type Props = {
  title: string;
  value: number;
  delta?: number | null;
  isBalance?: boolean;
};

export const WalletCardCell: React.FC<Props> = ({
  title,
  value,
  delta,
  isBalance = false,
}) => (
  <StyledWalletCell>
    <Title $empty={!isBalance && value === 0}>{title}:</Title>
    <Value $empty={!isBalance && value === 0}>
      <span data-tip={tooltipNumberContent(value)}>
        {formatNumber(value, value === 0 ? 0 : 1)}
      </span>
      {typeof delta === "number" && delta !== 0 && (
        <Delta $positive={delta > 0} data-tip={tooltipNumberContent(delta)}>
          {delta > 0 && "+"}
          {formatNumber(delta)}
        </Delta>
      )}
    </Value>
  </StyledWalletCell>
);
