import styled from "styled-components";
import { SpinnerContainer } from "../../../../components/common/icon-button/icon-button.styled";

export const StyledAllocationRewardsButton = styled.button`
  position: absolute;
  padding: 0;
  top: 50%;
  left: 50%;
  background-color: transparent;
  border: none;
  outline: none;
  transform: translate(-50%, -50%);
  cursor: pointer;

  &:hover,
  &:focus {
    rect {
      fill: #344967;
    }
  }

  &:active {
    rect {
      fill: #283a53;
    }
  }

  svg {
    width: 35px;
    height: 24px;

    @media (max-width: 1920px) {
      width: 33px;
      height: 22px;
    }

    @media (max-width: 1440px) {
      width: 31px;
      height: 20px;
    }

    @media (max-width: 1280px) {
      width: 29px;
      height: 18px;
    }

    rect {
      transition: 0.2s;
    }
  }
`;

export const LoaderContainer = styled(SpinnerContainer)`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
`;
