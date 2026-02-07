import styled from "styled-components";

export const NameIconBox = styled.span`
  position: absolute;
  top: 50%;
  left: -1px;
  width: 34px;
  height: 34px;
  transform: translateY(-50%);

  @media (max-width: 1920px) {
    width: 32px;
    height: 32px;
  }

  @media (max-width: 1440px) {
    width: 30px;
    height: 30px;
  }

  @media (max-width: 1280px) {
    width: 28px;
    height: 28px;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;
