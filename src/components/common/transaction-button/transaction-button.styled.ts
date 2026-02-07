import styled, { css } from "styled-components";

export const Button = styled.button<{ isLoading?: boolean }>`
  width: 100%;
  padding: 8px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  line-height: 1.14;
  font-weight: 700;
  color: #fff;
  background-color: #3e7cf4;
  box-shadow: 0px 3px 16px rgba(62, 124, 244, 0.3);
  border: 1px solid #3e7cf4;
  border-radius: 34px;
  outline: none;
  cursor: pointer;
  transition: 0.2s;
  ${({ isLoading }) =>
    isLoading
      ? ""
      : css`
          &:hover,
          &:focus {
            background-color: #3673ea;
          }

          &:active {
            background-color: #3269d3;
          }

          &:disabled {
            font-weight: 600;
            color: #3b5170;
            background-color: transparent;
            box-shadow: none;
            border-color: #3b5170;
            pointer-events: none;

            path {
              fill: #3b5170;
            }

            line {
              stroke: #3b5170;
            }
          }
        `}

  @media (max-width: 1920px) {
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
  }
`;
