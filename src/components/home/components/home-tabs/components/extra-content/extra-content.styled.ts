import styled from "styled-components";
import { EXTRA_CONTENT_FLEX_BASIS } from "../../home-tabs.styled";

export const Wrapper = styled.div`
  margin-left: 20px;
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  height: 34px;

  @media (max-width: 1920px) {
    height: 32px;
  }

  @media (max-width: 1440px) {
    height: 30px;
  }

  @media (max-width: 1280px) {
    height: 28px;
  }
`;

export const InputWrapper = styled.div`
  margin-right: 0;
  height: 100%;
  flex-basis: ${EXTRA_CONTENT_FLEX_BASIS["2560"]};
  font-size: 18px;

  @media (max-width: 1920px) {
    flex-basis: ${EXTRA_CONTENT_FLEX_BASIS["1920"]};
    font-size: 16px;
  }

  @media (max-width: 1440px) {
    flex-basis: ${EXTRA_CONTENT_FLEX_BASIS["1440"]};
    font-size: 14px;
  }

  @media (max-width: 1280px) {
    flex-basis: ${EXTRA_CONTENT_FLEX_BASIS["1280"]};
    font-size: 12px;
  }
`;
