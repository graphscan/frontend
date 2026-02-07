import ResizeObserver from "rc-resize-observer";
import { StyledCheckbox } from "./checkbox.styled";
import { useIsOverflow } from "../../../../../../../../../../utils/overflow.utils";
import { useTooltip } from "../../../../../../../../../../utils/tooltip.utils";

type Props = {
  checked: boolean;
  label: string;
  value: string;
  description: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Checkbox: React.FC<Props> = ({
  checked,
  label,
  description,
  value,
  onChange,
}) => {
  useTooltip();
  const { isOverflow, ref, checkIsOverflow } = useIsOverflow("vertical");

  return (
    <StyledCheckbox
      data-tip={isOverflow ? label : undefined}
      data-delay-show={0}
      data-delay-hide={0}
      checked={checked}
    >
      <span className="checkbox-input" />
      <span className="checkbox-label">
        <ResizeObserver onResize={checkIsOverflow}>
          <span ref={ref} className="checkbox-label-content">
            {label}
          </span>
        </ResizeObserver>
      </span>
      <div
        data-tip={description}
        data-class="title-description"
        className="checkbox-info-box"
      >
        <img src="/images/info.svg" alt="Info" />
      </div>
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
      />
    </StyledCheckbox>
  );
};
