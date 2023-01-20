import styled, { css } from 'styled-components';
import {
  InputContainer,
  Input,
  InputCleanButtonContainer,
} from '../../../../../../../../../common/input/input.styled';

export const Wrapper = styled(InputContainer)<{ disabled: boolean }>`
  background-color: ${({ disabled, focused }) =>
    disabled ? 'transparent' : focused ? '#203451' : '#243855'};
  ${({ disabled }) =>
    disabled
      ? css`
          border: 1px solid #3a537b;
          pointer-events: none;
        `
      : ''}
`;

export const StyledInput = styled(Input)`
  padding: 0 8px;
  font-size: 20px;

  @media (max-width: 1920px) {
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
  }

  &:disabled {
    color: #6a82a6;
  }
`;

export const CleanButtonContainer = styled(InputCleanButtonContainer)`
  margin: 0 15px;
  width: 18px;
  height: 18px;

  @media (max-width: 1920px) {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 1440px) {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 1280px) {
    width: 12px;
    height: 12px;
  }

  img {
    width: 100%;
  }
`;
