import styled, { css } from "styled-components";
import {
  InputContainer,
  Input as _Input,
} from "../../../../../../../../../common/input/input.styled";
import { CloseButton as _CloseButton } from "../../../../../../../../../common/close-button/close-button.styled";

export const StyledInput = styled.div`
  position: relative;
  padding-bottom: 23px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.05;

  .input-label {
    margin-bottom: 6px;
    display: inline-flex;
    color: #c6d7ef;
    cursor: default;
  }

  .input-error {
    position: absolute;
    bottom: 8px;
    left: 0;
    color: #ef3859;
  }
`;

export const Wrapper = styled(InputContainer)<{
  disabled: boolean;
  error: boolean;
}>`
  height: 40px;
  border-bottom: 1px solid transparent;
  pointer-events: ${(p) => (p.disabled ? "none" : "auto")};

  ${(p) =>
    p.error && !p.disabled
      ? css`
          border-bottom-color: #ef3859;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `
      : ""}
`;

export const Textfield = styled(_Input)`
  padding: 8px 0 8px 16px;
  font-size: 16px;

  &:disabled {
    color: #b7c8e2;
  }

  &::placeholder {
    color: #476288;
  }
`;

export const CloseButton = styled(_CloseButton)`
  margin: 0 8px;

  img {
    width: 14px;
    height: 14px;
  }
`;
