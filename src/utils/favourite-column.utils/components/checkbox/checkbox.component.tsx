import { ChangeEvent, KeyboardEvent } from "react";
import { Label, Input, StyledStar } from "./checkbox.styled";
import { preventDefault } from "../../../events.utils";

type Props = {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const Checkbox: React.FC<Props> = ({ checked, onChange }) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (
      e.key === "Enter" &&
      e.target instanceof HTMLSpanElement &&
      e.target.previousElementSibling instanceof HTMLInputElement
    ) {
      e.target.previousElementSibling.click();
    }
  };

  return (
    <Label role="checkbox" aria-checked={checked}>
      <Input type="checkbox" checked={checked} onChange={onChange} />
      <StyledStar
        checked={checked}
        onMouseDown={preventDefault}
        onKeyPress={handleKeyPress}
        tabIndex={0}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill={checked ? "#466087" : "none"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            // eslint-disable-next-line max-len
            d="M6.24897 4.63408L8 1.52744L9.75103 4.63408C9.94368 4.97587 10.2755 5.21694 10.6601 5.29454L14.1558 5.99987L11.7423 8.62521C11.4767 8.91404 11.35 9.30411 11.3951 9.69385L11.8045 13.2364L8.56182 11.7523C8.20507 11.589 7.79493 11.589 7.43818 11.7523L4.19553 13.2364L4.60495 9.69385C4.64999 9.30411 4.52325 8.91404 4.25772 8.62521L1.84423 5.99987L5.33992 5.29454L5.19159 4.55936L5.33992 5.29454C5.72451 5.21694 6.05632 4.97587 6.24897 4.63408Z"
            stroke="#466087"
            strokeWidth="1.5"
          />
        </svg>
      </StyledStar>
    </Label>
  );
};
