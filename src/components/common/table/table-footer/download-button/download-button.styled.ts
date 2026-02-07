import styled from "styled-components";

export const StyledDownloadButton = styled.button<{ $isLoading: boolean }>`
  padding: 0;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: ${({ $isLoading }) => ($isLoading ? "wait" : "pointer")};
  transition: margin 0.2s;

  &:hover,
  &:focus {
    path {
      fill: ${({ $isLoading }) => ($isLoading ? "" : "#3673ea")};
    }
  }

  &:active {
    margin-top: -2px;

    path {
      fill: ${({ $isLoading }) => ($isLoading ? "" : "#3269d3")};
    }
  }

  svg {
    width: 26px;
    height: 26px;

    @media (max-width: 1920px) {
      width: 24px;
      height: 24px;
    }

    @media (max-width: 1440px) {
      width: 22px;
      height: 22px;
    }

    @media (max-width: 1280px) {
      width: 20px;
      height: 20px;
    }
  }

  path:not(.rotator) {
    transition: 0.2s;
  }
`;
