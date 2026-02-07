import styled from "styled-components";
import { DetailsContainer } from "../../../../../common/details/details.styled";

export const Container = styled(DetailsContainer)`
  grid-template-columns: 1.5fr 1fr;
`;

export const MapContainer = styled.section`
  border: 2px solid #243855;
  border-top: none;

  @media (max-width: 1280px) {
    border-width: 1px;
  }
`;

export const WarningContainer = styled.span`
  position: relative;
`;

export const Warning = styled.span`
  position: absolute;
  top: calc(50% + 2px);
  right: 0;
  width: 40px;
  height: 40px;
  transform: translate(100%, -50%);

  @media (max-width: 1920px) {
    top: calc(50% + 1px);
    width: 38px;
    height: 38px;
  }

  @media (max-width: 1440px) {
    width: 36px;
    height: 36px;
  }

  @media (max-width: 1280px) {
    width: 34px;
    height: 34px;
  }
`;
