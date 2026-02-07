import styled from "styled-components";

export const TitleCell = styled.div`
  margin-bottom: 10px;
  padding: 0 35px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #243855;

  @media (max-width: 1280px) {
    margin-bottom: 5px;
  }
`;

export const Heading = styled.h2`
  font-weight: 500;
  font-size: 22px;
  color: #859ec3;
  white-space: nowrap;

  @media (max-width: 1920px) {
    font-size: 20px;
  }

  @media (max-width: 1440px) {
    font-size: 18px;
  }

  @media (max-width: 1280px) {
    font-size: 16px;
  }
`;

export const TotalGrt = styled.p`
  font-weight: 500;
  font-size: 20px;
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
`;

export const TotalValue = styled.span`
  font-weight: 700;
  font-size: 32px;
  color: #dae3ef;
  cursor: default;

  @media (max-width: 1920px) {
    font-size: 28px;
  }

  @media (max-width: 1440px) {
    font-size: 26px;
  }

  @media (max-width: 1280px) {
    font-size: 24px;
  }
`;

export const Stats = styled.article`
  padding-bottom: 5px;
  display: grid;
  flex-grow: 1;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;

  @media (max-width: 1440px) {
    padding-bottom: 10px;
  }

  @media (max-width: 1280px) {
    padding-bottom: 5px;
  }
`;
