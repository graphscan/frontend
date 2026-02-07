import styled from "styled-components";

export const Label = styled.label`
  position: relative;
`;

export const Input = styled.input`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
  cursor: pointer;
`;

export const StyledStar = styled.span<{ checked: boolean }>`
  margin: 0 auto;
  display: block;
  width: 22px;
  height: 16px;
  outline: none;
  cursor: pointer;

  &:hover,
  &:focus {
    svg {
      fill: ${({ checked }) => (checked ? "#344967" : "none")};

      path {
        stroke: #344967;
      }
    }
  }

  &:active {
    svg {
      fill: ${({ checked }) => (checked ? "#283a53" : "none")};

      path {
        stroke: #283a53;
      }
    }
  }

  @media (max-width: 1920px) {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 1440px) {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 1280px) {
    width: 16px;
    height: 16px;
  }

  svg {
    width: 100%;
    height: 100%;

    transition: fill 0.2s;

    path {
      transition: stroke 0.2s;
    }
  }
`;
