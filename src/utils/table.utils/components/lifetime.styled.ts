import styled, { css } from "styled-components";

const topDelay = 28;
const halfTopDelay = topDelay / 2;

export const Lifetime = styled.span<{ epochs: number }>`
  ${(p) =>
    p.epochs >= topDelay
      ? "color: #f4466d;"
      : p.epochs > halfTopDelay
        ? css`
            color: #758aa9;
            animation: change-color 1s paused;
            animation-delay: -${(p.epochs - halfTopDelay) / halfTopDelay}s;

            @keyframes change-color {
              to {
                color: #f4466d;
              }
            }
          `
        : css`
            color: #758aa9;
          `}
`;
