import styled, { css } from "styled-components";
import {
  IconButton,
  SpinnerContainer,
} from "../../../../../common/icon-button/icon-button.styled";

const centered = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const DelegatorDelegationsButton = styled(IconButton)`
  ${centered}
`;

export const DelegatorDelegationsSpinnerContainer = styled(SpinnerContainer)`
  ${centered}
`;
