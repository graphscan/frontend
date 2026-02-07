import styled from "styled-components";
import { Background } from "../background/background.styled";

export const StyledEmpty = styled(Background)`
  .empty-image-containter {
    margin-bottom: 20px;
    width: 70px;
    height: 70px;

    @media (max-width: 1920px) {
      width: 60px;
      height: 60px;
    }

    @media (max-width: 1440px) {
      width: 50px;
      height: 50px;
    }

    @media (max-width: 1280px) {
      width: 40px;
      height: 40px;
    }

    img {
      width: 100%;
    }
  }

  .empty-description {
    font-weight: 500;
    font-size: 20px;
    line-height: 1;
    color: #859ec3;

    @media (max-width: 1920px) {
      font-size: 18px;
    }

    @media (max-width: 1440px) {
      font-size: 16px;
    }

    @media (max-width: 1280px) {
      font-size: 14px;
    }
  }
`;
