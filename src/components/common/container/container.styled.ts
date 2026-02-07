import styled from "styled-components";

export const CONTAINER_PADDING = 30;

export const Container = styled.div`
  margin: 0 auto;
  max-width: calc(2065px + ${CONTAINER_PADDING * 2}px);
  padding: 0 ${CONTAINER_PADDING}px;
  width: 100%;

  @media (max-width: 1920px) {
    max-width: calc(1440px + ${CONTAINER_PADDING * 2}px);
  }

  @media (max-width: 1440px) {
    max-width: calc(1280px + ${CONTAINER_PADDING * 2}px);
  }

  @media (max-width: 1280px) {
    max-width: calc(1184px + ${CONTAINER_PADDING * 2}px);
  }
`;
