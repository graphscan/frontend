import styled, { css } from 'styled-components';
import { Row, Key } from '../../web3-delegation.styled';

export const FormStatusRow = styled(Row)`
  margin-bottom: 13px;
  padding: 0;
  border: none;
`;

export const FormKey = styled(Key)<{ small: boolean }>`
  font-weight: 500;
  color: #95b0d9;
  ${({ small }) =>
    small
      ? css`
          font-size: 18px;

          @media (max-width: 1920px) {
            font-size: 16px;
          }

          @media (max-width: 1440px) {
            font-size: 14px;
          }

          @media (max-width: 1280px) {
            font-size: 12px;
          }
        `
      : ''}
`;

export const FormInput = styled.div`
  margin-bottom: 16px;
  height: 36px;

  @media (max-width: 1920px) {
    height: 34px;
  }

  @media (max-width: 1440px) {
    height: 32px;
  }

  @media (max-width: 1280px) {
    height: 30px;
  }
`;

export const FormDescription = styled.p`
  margin-bottom: 24px;
  font-size: 18px;
  line-height: 1.17;
  color: #758aa9;

  @media (max-width: 1920px) {
    font-size: 16px;
  }

  @media (max-width: 1440px) {
    font-size: 14px;
  }

  @media (max-width: 1280px) {
    font-size: 12px;
  }
`;

export const ButtonWrapper = styled.div<{ indexer: boolean }>`
  width: fit-content;
  min-width: 270px;
  margin-bottom: ${({ indexer }) => (indexer ? '32px' : '0')};

  @media (max-width: 1920px) {
    min-width: 245px;
  }

  @media (max-width: 1440px) {
    min-width: 225px;
  }

  @media (max-width: 1280px) {
    min-width: 210px;
  }
`;
