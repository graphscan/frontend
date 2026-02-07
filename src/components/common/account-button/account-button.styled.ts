import styled from "styled-components";
import { IconButton } from "../icon-button/icon-button.styled";

export const AccountButton = styled(IconButton)`
  margin-right: 6px;

  &:last-child {
    margin-right: 0;
  }

  svg {
    width: 32px;
    height: 22px;

    @media (max-width: 1920px) {
      width: 30px;
      height: 20px;
    }

    @media (max-width: 1440px) {
      width: 28px;
      height: 18px;
    }

    @media (max-width: 1280px) {
      width: 26px;
      height: 16px;
    }
  }
`;
