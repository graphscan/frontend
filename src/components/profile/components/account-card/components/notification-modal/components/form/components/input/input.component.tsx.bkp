import { ChangeEvent, useCallback, useState } from "react";
import { StyledInput, Wrapper, Textfield, CloseButton } from "./input.styled";
import { RedText } from "../../form.styled";

type Props = {
  value: string;
  placeholder: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  setValue: (value: string) => void;
};

export const Input: React.FC<Props> = ({
  placeholder,
  value,
  label,
  error,
  setValue,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const toggleFocus = useCallback(
    () => setIsFocused((prevState) => !prevState),
    [],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
    [setValue],
  );

  return (
    <StyledInput>
      <label className="input-label">
        {label}&#8203;
        {disabled ? "" : <RedText>*</RedText>}
      </label>
      <Wrapper disabled={disabled} $focused={isFocused} error={Boolean(error)}>
        <Textfield
          onFocus={toggleFocus}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onBlur={toggleFocus}
          placeholder={placeholder}
        />
        {!disabled && value.length > 0 && (
          <CloseButton type="button" onClick={() => setValue("")}>
            <svg
              width="14"
              height="13"
              viewBox="0 0 14 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="12"
                y1="1.41421"
                x2="2.41421"
                y2="11"
                stroke="#95B0D9"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="1"
                y1="-1"
                x2="14.5563"
                y2="-1"
                transform="matrix(0.707107 0.707107 0.707107 -0.707107 2.27725 0)"
                stroke="#95B0D9"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </CloseButton>
        )}
      </Wrapper>
      {!disabled && error && <div className="input-error">*{error}</div>}
    </StyledInput>
  );
};
