import styled from "styled-components";

export const IconButton = styled.button`
  padding: 0;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;

  &:hover,
  &:focus {
    rect {
      fill: #344967;
      stroke: #344967;
    }
  }

  &:active {
    rect {
      fill: #283a53;
      stroke: #283a53;
    }
  }

  &:disabled {
    pointer-events: none;

    rect {
      fill: none;
      stroke: #3b5170;
    }

    path {
      fill: #3b5170;
    }

    line {
      stroke: #3b5170;
    }
  }

  svg {
    width: 34px;
    height: 24px;

    @media (max-width: 1920px) {
      width: 32px;
      height: 22px;
    }

    @media (max-width: 1440px) {
      width: 30px;
      height: 20px;
    }

    @media (max-width: 1280px) {
      width: 28px;
      height: 18px;
    }

    rect {
      fill: #3b5170;
      transition: 0.2s;
    }

    path {
      fill: #fff;
    }

    line {
      stroke: #fff;
    }
  }
`;

export const SpinnerContainer = styled.div`
  svg {
    width: 34px;
    height: 24px;

    @media (max-width: 1920px) {
      width: 32px;
      height: 22px;
    }

    @media (max-width: 1440px) {
      width: 30px;
      height: 20px;
    }

    @media (max-width: 1280px) {
      width: 28px;
      height: 18px;
    }
  }
`;
