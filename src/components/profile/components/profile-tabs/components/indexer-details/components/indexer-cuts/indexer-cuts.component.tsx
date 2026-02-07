import { Postfix } from "../../../../../../../common/details/details.styled";
import { EffectiveRealContainer } from "../../../../../../../common/effective-real-container/effective-real-container.styled";
import { formatPercents } from "../../../../../../../../utils/number.utils";
import { renderEffectiveRealTooltip } from "../../../../../../../../utils/table.utils";

type Props = {
  effectiveValue: number | null;
  realTitle: string;
  realValue: number;
};

export const IndexerCuts: React.FC<Props> = ({
  effectiveValue,
  realTitle,
  realValue,
}) => {
  return effectiveValue !== null ? (
    <>
      <span
        data-html
        data-tip={renderEffectiveRealTooltip({
          effectiveValue,
          realTitle,
          realValue,
        })}
      >
        {formatPercents(effectiveValue)}
      </span>
      <Postfix> %</Postfix>
    </>
  ) : (
    <EffectiveRealContainer
      data-html
      data-tip={renderEffectiveRealTooltip({
        effectiveValue: null,
        realTitle,
        realValue,
      })}
      $withPadding
    >
      -
    </EffectiveRealContainer>
  );
};
