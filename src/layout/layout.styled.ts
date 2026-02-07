import styled from "styled-components";
import { Container } from "../components/common/container/container.styled";

export const LayoutWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 960px;
  width: 100%;
  height: 100%;
`;

export const Section = styled(Container)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-height: 100%;
`;
