import styled from "styled-components";
import { FooterContainer } from "../../footer-container/footer-container.styled";

export const Wrapper = styled.footer`
  font-weight: 500;
  font-size: 18px;
  line-height: 1.33;
  color: #fff;

  @media (max-width: 1920px) {
    font-size: 16px;
  }

  @media (max-width: 1440px) {
    font-size: 14px;
  }

  @media (max-width: 1280px) {
    font-size: 12px;
  }
`;

export const Container = styled(FooterContainer)<{ $isLogoOnly: boolean }>`
  justify-content: space-between;
  flex-direction: ${(p) => (p.$isLogoOnly ? "row-reverse" : "row")};
`;

export const LeftSide = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Result = styled.span`
  color: #859ec3;
`;

export const DownloadButtonContainer = styled.div`
  margin-left: 10px;
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
`;

export const PaginationContainer = styled.div`
  max-width: 900px;
  margin-right: 130px;
  width: 46%;
`;
