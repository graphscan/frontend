import { useState, useCallback } from "react";
import {
  StyledWarning,
  WarningContainer,
  WarningCloseButton,
} from "./warning.styled";
import { preventDefault } from "../../../../../utils/events.utils";

type Props = {
  title: string;
  description?: string;
  hasBorderBottom?: boolean;
};

export const Warning: React.FC<Props> = ({
  title,
  description,
  hasBorderBottom,
}) => {
  const [showWarning, setShowWarning] = useState(true);
  const closeWarning = useCallback(() => {
    setShowWarning(false);
  }, []);

  return showWarning ? (
    <StyledWarning $hasBorderBottom={Boolean(hasBorderBottom)}>
      <WarningContainer>
        <h3 className="warning-title">{title}</h3>
        {Boolean(description) && (
          <p className="warning-description">{description}</p>
        )}
      </WarningContainer>
      <WarningCloseButton onClick={closeWarning} onMouseDown={preventDefault}>
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
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="1"
            y1="-1"
            x2="14.5563"
            y2="-1"
            transform="matrix(0.707107 0.707107 0.707107 -0.707107 2.27725 0)"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </WarningCloseButton>
    </StyledWarning>
  ) : null;
};
