import styled from "styled-components";
import {
  Container,
  CONTAINER_PADDING,
} from "../../../../../components/common/container/container.styled";
import { CloseButton } from "../../../../../components/common/close-button/close-button.styled";

const WARNING_PADDING = 7;

export const StyledWarning = styled.section<{ $hasBorderBottom: boolean }>`
  position: relative;
  padding: ${WARNING_PADDING}px 0;
  width: 100%;
  background-color: #f86342;
  z-index: 50;
  ${(p) => (p.$hasBorderBottom ? "border-bottom: 1px solid #fff;" : "")}

  .warning-title {
    position: relative;
    font-weight: bold;
    font-size: 22px;
    line-height: 1;
    color: #fff;

    @media (max-width: 1920px) {
      font-size: 20px;
    }

    @media (max-width: 1440px) {
      font-size: 18px;
    }

    @media (max-width: 1280px) {
      font-size: 16px;
    }

    &:before {
      position: absolute;
      content: "";
      top: 50%;
      left: -2px;
      width: 26px;
      height: 22px;
      background-image: url("/images/warning.svg");
      background-size: cover;
      transform: translate(-100%, -50%);

      @media (max-width: 1920px) {
        width: 24px;
        height: 20px;
      }

      @media (max-width: 1440px) {
        width: 22px;
        height: 18px;
      }

      @media (max-width: 1280px) {
        width: 20px;
        height: 16px;
      }
    }
  }

  .warning-description {
    margin-top: 5px;
    font-weight: 500;
    font-size: 18px;
    line-height: 1;
    color: #fff;

    @media (max-width: 1920px) {
      font-size: 16px;
    }

    @media (max-width: 1440px) {
      font-size: 14px;
    }

    @media (max-width: 1280px) {
      font-size: 12px;
    }
  }
`;

export const WarningContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const WarningCloseButton = styled(CloseButton)`
  position: absolute;
  top: 50%;
  right: ${CONTAINER_PADDING}px;
  transform: translateY(-50%);

  &:hover,
  &:focus {
    svg {
      line {
        stroke: rgba(255, 255, 255, 0.7);
      }
    }
  }

  &:active {
    svg {
      line {
        stroke: rgba(255, 255, 255, 0.4);
      }
    }
  }

  svg {
    line {
      stroke: #fff;
      transition: stroke 0.2s;
    }
  }
`;
