import styled from "styled-components";

export const Icon = styled.div`
  margin-left: 14px;
  display: flex;
  align-items: center;
  height: 100%;

  svg {
    width: 20px;
    height: 20px;

    @media (max-width: 1920px) {
      width: 18px;
      height: 18px;
    }

    @media (max-width: 1440px) {
      width: 16px;
      height: 16px;
    }

    @media (max-width: 1280px) {
      width: 14px;
      height: 14px;
    }
  }
`;
