import styled from "styled-components";
import { Link } from "../../../common/link/link.styled";

export const Hint = styled.div`
  margin-left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.33;
  background-color: #3b5170;
  border-radius: 50%;
  cursor: default;

  @media (max-width: 1920px) {
    width: 18px;
    height: 18px;
    font-size: 14px;
  }

  @media (max-width: 1440px) {
    width: 16px;
    height: 16px;
    font-size: 12px;
  }

  @media (max-width: 1280px) {
    width: 14px;
    height: 14px;
    font-size: 10px;
  }
`;

export const HintTooltip = styled.article`
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.25;

  @media (max-width: 1920px) {
    font-size: 14px;
  }

  @media (max-width: 1440px) {
    font-size: 12px;
  }

  @media (max-width: 1280px) {
    font-size: 10px;
  }
`;

export const HintLink = styled(Link)`
  font-weight: 600;
  text-decoration: none !important;
`;

export const IconBox = styled.div`
  margin-right: 4px;
  display: flex;
  flex-shrink: 0;
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

  svg {
    width: 100%;
    height: 100%;
  }
`;
