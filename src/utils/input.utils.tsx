import { useCallback, useEffect, useState, ChangeEvent } from "react";
import { CloseButton } from "../components/common/close-button/close-button.styled";

export const useControlledInput = (value?: string) => {
  const [currentValue, setCurrentValue] = useState<string>("");

  useEffect(() => {
    if (typeof value === "string") {
      setCurrentValue(value);
    }
  }, [value]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(e.target.value);
  }, []);

  const clean = () => setCurrentValue("");

  const CleanInputButton =
    currentValue.length > 0 ? (
      <CloseButton type="button" onClick={clean}>
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
    ) : null;

  return {
    currentValue,
    setCurrentValue,
    onChange,
    CleanInputButton,
  };
};
