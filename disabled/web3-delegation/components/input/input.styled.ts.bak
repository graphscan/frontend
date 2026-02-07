import styled from 'styled-components';
import {
  InputContainer,
  Input,
  InputButton,
  InputCleanButtonContainer,
} from '../../../../../common/input/input.styled';

export const Wrapper = styled(InputContainer)<{ disabled: boolean }>`
  background-color: ${({ disabled, focused }) =>
    disabled ? 'transparent' : focused ? '#203451' : '#243855'};
  ${({ disabled }) => (disabled ? 'border: 1px solid #3a537b' : '')}
`;

export const StyledInput = styled(Input)`
  padding: 0 7px;
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

export const Button = styled(InputButton)`
  margin-right: 7px;
  padding: 0 7px;
  font-size: 18px;
  font-weight: 500;
  color: #fff;
  background: #3e7cf4;
  box-shadow: 0px 2px 8px rgba(62, 124, 244, 0.3);
  border: 1px solid #3e7cf4;
  border-radius: 34px;
  transition: 0.2s;

  @media (max-width: 1920px) {
    font-size: 16px;
  }

  @media (max-width: 1440px) {
    font-size: 14px;
  }

  @media (max-width: 1280px) {
    font-size: 12px;
  }

  &:hover,
  &:focus {
    background-color: #3673ea;
    border-color: #3673ea;
  }

  &:active {
    background-color: #3269d3;
    border-color: #3269d3;
  }

  &:disabled {
    font-weight: 600;
    color: #3b5170;
    background-color: transparent;
    box-shadow: none;
    border-color: #3b5170;
    pointer-events: none;
  }
`;

export const CleanButtonContainer = styled(InputCleanButtonContainer)`
  margin: 0 8px;

  img {
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
  }
`;
