import styled from "styled-components";
import { Tabs as TabsMixin } from "../../../common/tabs/tabs.styled";

export const EXTRA_CONTENT_FLEX_BASIS = {
  2560: "780px",
  1920: "670px",
  1440: "590px",
  1280: "530px",
};

export const Tabs = styled(TabsMixin)`
  justify-content: space-between;
  align-items: center;
`;

export const TabButtons = styled.section`
  display: flex;
`;

export const TabsExtraContent = styled.section`
  flex-basis: ${EXTRA_CONTENT_FLEX_BASIS["2560"]};
  display: flex;
  align-items: center;

  @media (max-width: 1920px) {
    flex-basis: ${EXTRA_CONTENT_FLEX_BASIS["1920"]};
  }

  @media (max-width: 1440px) {
    flex-basis: ${EXTRA_CONTENT_FLEX_BASIS["1440"]};
  }

  @media (max-width: 1280px) {
    flex-basis: ${EXTRA_CONTENT_FLEX_BASIS["1280"]};
  }
`;
