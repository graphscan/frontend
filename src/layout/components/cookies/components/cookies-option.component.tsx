import { useState } from "react";
import AnimateHeight from "react-animate-height";

import { StyledCookiesOption } from "./cookies-option.styled";

import { Switch } from "../../../../components/common/switch/switch.component";

type Props = {
  label: string;
  children?: React.ReactNode;
} & (
  | { switchable?: false }
  | { switchable: true; isChecked: boolean; onChange: () => void }
);

export const CookiesOption: React.FC<Props> = (props) => {
  const { label, switchable, children } = props;
  const [height, setHeight] = useState<0 | "auto">(0);

  const toggleHeight = () => setHeight(height === 0 ? "auto" : 0);

  return (
    <StyledCookiesOption isExpanded={height === "auto"}>
      <section className="cookies-option">
        <div onClick={toggleHeight} className="cookies-option-value">
          <svg
            className="cookies-dropdown-arrow"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="11" fill="#3b5170" />
            <path
              d="M11 14L7 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M11 14L15 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p className="cookies-option-text">{label}</p>
        </div>
        {switchable ? (
          <Switch
            checked={props.isChecked}
            onChange={props.onChange}
            width={40}
            height={22}
            handleDiameter={18}
          />
        ) : (
          <p className="cookies-option-text cookies-option-text_orange">
            Always Active
          </p>
        )}
      </section>
      <AnimateHeight height={height} duration={250}>
        <section className="cookies-option-description">{children}</section>
      </AnimateHeight>
    </StyledCookiesOption>
  );
};
