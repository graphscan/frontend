import styled from "styled-components";

export const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
  background-color: #243855;
  border-bottom: 2px solid #243855;

  @media (max-width: 1280px) {
    gap: 1px;
    border-width: 1px;
  }
`;

export const HeaderCell = styled.div`
  padding: 16px 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #192434;
`;

export const Description = styled.section`
  padding: 16px 26px;
  min-height: 118px;

  @media (max-width: 1920px) {
    min-height: 110px;
  }

  @media (max-width: 1440px) {
    min-height: 102px;
  }

  @media (max-width: 1280px) {
    min-height: 96px;
  }
`;

export const DescriptionHeading = styled.h3`
  margin-bottom: 10px;
  font-weight: 600;
  font-size: 20px;
  color: #a6bbdd;

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

export const DescriptionText = styled.p<{ truncate?: boolean }>`
  font-weight: 500;
  font-size: 20px;
  line-height: 1.36;
  color: #fff;
  cursor: ${({ truncate }) => (truncate ? "pointer" : "default")};

  ${({ truncate }) =>
    truncate &&
    `
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
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

export const DescriptionButton = styled.button`
  color: #387bca;
  font-size: 20px;
  line-height: 1.36;
  background-color: transparent;
  cursor: pointer;
  border: none;
  outline: none;
  transition: 0.2s;

  @media (max-width: 1920px) {
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
  }

  &:hover,
  &:focus {
    color: #3b73df;
  }

  &:active {
    color: #3269d2;
  }
`;

export const ModalDescription = styled.section`
  width: 700px;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.36;
  color: #fff;

  @media (max-width: 1920px) {
    width: 615px;
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    width: 555px;
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    width: 500px;
    font-size: 14px;
  }
`;

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

export const Cell = styled.div`
  margin-bottom: 5px;
  padding: 0 35px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;

  @media (max-width: 1920px) {
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    margin-bottom: 0;
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
  }
`;

export const Key = styled.p<{ empty: boolean }>`
  margin-bottom: 10px;
  color: ${({ empty }) => (empty ? "#3b5170" : "#859ec3")};
`;

export const Value = styled.p<{ empty: boolean }>`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 22px;
  color: ${({ empty }) => (empty ? "#3b5170" : "#fff")};
  cursor: default;

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

export const Delta = styled.span<{ positive: boolean }>`
  padding: 1px 3px;
  margin-left: 10px;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.17;

  text-align: center;

  color: ${({ positive }) => (positive ? "#2ad698" : "#f4466d")};
  background-color: ${({ positive }) =>
    positive ? "rgba(42, 214, 152, 0.2)" : "rgba(244, 70, 109, 0.2)"};
  border-radius: 3px;

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
