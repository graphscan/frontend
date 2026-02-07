import styled from "styled-components";
import {
  Input,
  InputButton,
  InputCleanButtonContainer,
} from "../../../../../../../common/input/input.styled";

export const StyledInput = styled(Input)`
  flex-grow: 1;
`;

export const Button = styled(InputButton)`
  margin-right: 3px;

  img {
    width: 22px;
    height: 22px;

    @media (max-width: 1920px) {
      width: 20px;
      height: 20px;
    }

    @media (max-width: 1440px) {
      width: 18px;
      height: 18px;
    }

    @media (max-width: 1280px) {
      width: 16px;
      height: 16px;
    }
  }
`;

export const CleanButtonContainer = styled(InputCleanButtonContainer)`
  margin: 0 6px;

  img {
    width: 16px;
    height: 16px;

    @media (max-width: 1920px) {
      width: 14px;
      height: 14px;
    }

    @media (max-width: 1440px) {
      width: 12px;
      height: 12px;
    }

    @media (max-width: 1280px) {
      width: 10px;
      height: 10px;
    }
  }
`;
