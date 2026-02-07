import styled from "styled-components";

export const StyledWalletCell = styled.div`
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

export const Title = styled.p<{ $empty: boolean }>`
  margin-bottom: 10px;
  color: ${({ $empty }) => ($empty ? "#3b5170" : "#859ec3")};
`;

export const Value = styled.p<{ $empty: boolean }>`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 22px;
  color: ${({ $empty }) => ($empty ? "#3b5170" : "#fff")};
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

export const Delta = styled.span<{ $positive: boolean }>`
  padding: 1px 3px;
  margin-left: 10px;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.17;

  text-align: center;

  color: ${({ $positive }) => ($positive ? "#2ad698" : "#f4466d")};
  background-color: ${({ $positive }) =>
    $positive ? "rgba(42, 214, 152, 0.2)" : "rgba(244, 70, 109, 0.2)"};
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
