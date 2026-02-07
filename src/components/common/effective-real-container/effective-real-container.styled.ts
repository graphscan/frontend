import styled, { css } from "styled-components";

export const EffectiveRealContainer = styled.span<{ $withPadding: boolean }>`
  position: relative;
  ${({ $withPadding }) =>
    $withPadding
      ? css`
          &:after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 15px;
            transform: translate(-50%, -50%);
          }
        `
      : ""}
`;
