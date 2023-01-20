import styled, { css } from 'styled-components';
import { Link } from '../../../../../../../common/link/link.styled';
import { DescriptionBlock } from '../../../../../../../common/description-block/description-block.styled';

export const Container = styled.article`
  max-width: 1350px;

  @media (max-width: 1920px) {
    max-width: 1012px;
  }

  @media (max-width: 1440px) {
    max-width: 760px;
  }

  @media (max-width: 1280px) {
    max-width: 675px;
  }
`;

export const Header = styled.header`
  display: flex;
  width: 100%;
  background-color: #1f2d40;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  min-height: 407px;

  @media (max-width: 1920px) {
    min-height: 426px;
  }

  @media (max-width: 1440px) {
    min-height: 415px;
  }

  @media (max-width: 1280px) {
    min-height: 382px;
  }
`;

export const Tab = styled.div<{ active: boolean }>`
  padding: 16px;
  display: flex;
  justify-content: center;
  width: 50%;
  font-size: 20px;
  line-height: 1;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  ${(p) =>
    p.active
      ? css`
          font-weight: bold;
          color: #fff;
          border-bottom-color: #f86342;
          transition: border-color 0.5s, color 0.2s;
        `
      : css`
          font-weight: 500;
          color: #859ec3;
          border-bottom-color: #243855;
          transition: color 0s;
        `}

  @media (max-width: 1920px) {
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
    border-bottom-width: 1px;
  }
`;

export const Content = styled(DescriptionBlock)`
  margin-bottom: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  background-color: #1f2d40;
  border-top-right-radius: 0;
  border-top-left-radius: 0;

  a {
    font-weight: bold;
    font-size: 20px;
    line-height: 1.36;
    text-decoration-line: underline;
    color: #4d9fff;

    @media (max-width: 1920px) {
      font-size: 18px;
    }

    @media (max-width: 1440px) {
      font-size: 16px;
    }

    @media (max-width: 1280px) {
      font-size: 14px;
    }
  }
`;

export const Anchor = styled(Link)`
  margin-bottom: 20px;
  display: inline-block;
  font-weight: bold;
  font-size: 20px;
  line-height: 1.36;
  color: #4d9fff;

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

export const DescriptionText = styled.p`
  font-weight: 500;
  font-size: 20px;
  line-height: 1.36;
  color: #fff;

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

export const Label = styled.label`
  display: block;
  font-weight: 500;
  font-size: 20px;
  line-height: 1;
  color: #859ec3;

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

export const InputWrapper = styled.div`
  margin: 5px 0 16px 0;
  display: flex;
  align-items: center;
  max-width: 660px;
  height: 40px;
  flex-grow: 1;

  @media (max-width: 1920px) {
    max-width: 495px;
    height: 38px;
  }

  @media (max-width: 1440px) {
    max-width: 370px;
    height: 36px;
  }

  @media (max-width: 1280px) {
    max-width: 330px;
    height: 34px;
  }
`;

export const ButtonWrapper = styled.div`
  width: 130px;

  @media (max-width: 1920px) {
    width: 120px;
  }

  @media (max-width: 1440px) {
    width: 110px;
  }

  @media (max-width: 1280px) {
    width: 100px;
  }
`;

export const Notice = styled.p`
  font-weight: normal;
  font-size: 18px;
  line-height: 1.33;
  color: #859ec3;

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
