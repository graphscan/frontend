import styled from "styled-components";
import { Empty } from "../../../../../common/empty/empty.component";

export const Container = styled.div`
  position: relative;
  background-color: #192434;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`;

export const TitleContainer = styled.div`
  position: absolute;
  top: 16px;
  left: 26px;
  min-width: 420px;

  @media (max-width: 1920px) {
    min-width: 385px;
  }

  @media (max-width: 1440px) {
    min-width: 350px;
  }

  @media (max-width: 1280px) {
    min-width: 315px;
  }
`;

export const TitleText = styled.span`
  font-weight: 600;
  font-size: 20px;
  line-height: 1;
  color: #b7c8e2;

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

export const EmptyContainer = styled(Empty)`
  padding-top: 72px;
  padding-bottom: 72px;
`;
