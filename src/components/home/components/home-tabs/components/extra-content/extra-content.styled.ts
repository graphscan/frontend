import styled from 'styled-components';
import { EXTRA_CONTENT_FLEX_BASIS } from '../../home-tabs.styled';
import { GreyButton } from '../../../../../common/grey-button/grey-button.styled';

export const Wrapper = styled.div`
  margin-left: 20px;
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
  height: 34px;

  @media (max-width: 1920px) {
    height: 32px;
  }

  @media (max-width: 1440px) {
    height: 30px;
  }

  @media (max-width: 1280px) {
    height: 28px;
  }
`;

export const InputWrapper = styled.div<{ fullwidth: boolean }>`
  margin-right: ${({ fullwidth }) => (fullwidth ? 0 : '12px')};
  height: 100%;
  flex-basis: ${({ fullwidth }) => (fullwidth ? EXTRA_CONTENT_FLEX_BASIS['2560'] : '595px')};
  font-size: 18px;

  @media (max-width: 1920px) {
    flex-basis: ${({ fullwidth }) => (fullwidth ? EXTRA_CONTENT_FLEX_BASIS['1920'] : '485px')};
    font-size: 16px;
  }

  @media (max-width: 1440px) {
    flex-basis: ${({ fullwidth }) => (fullwidth ? EXTRA_CONTENT_FLEX_BASIS['1440'] : '425px')};
    font-size: 14px;
  }

  @media (max-width: 1280px) {
    flex-basis: ${({ fullwidth }) => (fullwidth ? EXTRA_CONTENT_FLEX_BASIS['1280'] : '395px')};
    font-size: 12px;
  }
`;

export const Button = styled(GreyButton)`
  padding: 0px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.14;
  border-radius: 34px;
  white-space: nowrap;

  @media (max-width: 1920px) {
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
  }
`;
