import styled from 'styled-components';
import { Link } from '../../link/link.styled';

export const Container = styled.article`
  padding: 16px 12px 16px 0;
  display: flex;
  width: 100%;
  height: 100%;
`;

export const Left = styled.section`
  margin: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140px;
`;

export const Right = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  min-height: 132px;

  @media (max-width: 1920px) {
    min-height: 122px;
  }

  @media (max-width: 1440px) {
    min-height: 112px;
  }

  @media (max-width: 1280px) {
    min-height: 106px;
  }
`;

export const Image = styled.div`
  img {
    width: 112px;
    height: 112px;

    @media (max-width: 1920px) {
      width: 108px;
      height: 108px;
    }

    @media (max-width: 1440px) {
      width: 104px;
      height: 104px;
    }

    @media (max-width: 1280px) {
      width: 100px;
      height: 100px;
    }
  }
`;

export const Name = styled.p`
  margin-top: 8px;
  width: 140px;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.14;
  color: #dae3ef;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: default;

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

export const Title = styled.header`
  margin-bottom: 13px;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  min-height: 40px;

  @media (max-width: 1920px) {
    min-height: 38px;
  }

  @media (max-width: 1440px) {
    min-height: 36px;
  }

  @media (max-width: 1280px) {
    min-height: 34px;
  }
`;

export const Heading = styled.h2<{ warning?: boolean }>`
  margin-right: ${({ warning }) => (warning ? '0' : '12px')};
  max-width: 650px;
  font-weight: bold;
  font-size: 26px;
  line-height: 1.15;
  color: #dae3ef;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;

  @media (max-width: 1920px) {
    max-width: 400px;
    font-size: 24px;
  }

  @media (max-width: 1440px) {
    max-width: 315px;
    font-size: 22px;
  }

  @media (max-width: 1280px) {
    max-width: 300px;
    font-size: 20px;
  }
`;

export const ButtonContainer = styled.div`
  margin-right: 12px;
`;

export const SelectContainer = styled.div`
  position: relative;
  margin-left: auto;
  width: 160px;

  @media (max-width: 1920px) {
    width: 150px;
  }

  @media (max-width: 1440px) {
    width: 142px;
  }

  @media (max-width: 1280px) {
    width: initial;
    flex-basis: 25%;
  }
`;

export const NewLabel = styled.span`
  position: absolute;
  top: calc(-50% + 3px);
  right: -7.5%;

  img {
    width: 45px;
    height: 34px;

    @media (max-width: 1920px) {
      width: 43px;
      height: 32px;
    }

    @media (max-width: 1440px) {
      width: 41px;
      height: 30px;
    }

    @media (max-width: 1280px) {
      width: 39px;
      height: 28px;
    }
  }
`;

export const Description = styled.div<{ oneLine?: boolean }>`
  position: relative;
  margin-bottom: ${({ oneLine }) => (oneLine ? 'auto' : '25px')};
  padding-left: 32px;

  @media (max-width: 1920px) {
    padding-left: 30px;
  }

  @media (max-width: 1440px) {
    padding-left: 28px;
  }

  @media (max-width: 1280px) {
    padding-left: 24px;
  }

  img {
    position: absolute;
    top: -7px;
    left: 0px;
    width: 25px;
    height: 28px;

    @media (max-width: 1920px) {
      width: 23px;
      height: 27px;
    }

    @media (max-width: 1440px) {
      width: 21px;
      height: 24px;
    }

    @media (max-width: 1280px) {
      width: 17px;
      height: 20px;
    }
  }
`;

export const DescriptionContainer = styled.div`
  display: flex;
`;

export const Text = styled.p`
  font-weight: 500;
  font-size: 20px;
  line-height: 1.33;
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

export const Accounts = styled.p`
  margin-top: 5px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(165px, max-content));
  gap: 5px 15px;

  @media (max-width: 1920px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, max-content));
  }

  @media (max-width: 1440px) {
    grid-template-columns: repeat(auto-fill, minmax(130px, max-content));
    column-gap: 12px;
  }

  @media (max-width: 1280px) {
    grid-template-columns: repeat(auto-fill, minmax(115px, max-content));
  }
`;

export const AccountLink = styled(Link)`
  font-weight: 500;
  font-size: 20px;
  line-height: 1;

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

export const Footer = styled.footer`
  display: flex;
  align-items: flex-end;
`;

export const ButtonWrapper = styled.div`
  margin-left: 14px;
  min-width: 160px;

  @media (max-width: 1920px) {
    min-width: 150px;
  }

  @media (max-width: 1440px) {
    min-width: 140px;
  }

  @media (max-width: 1280px) {
    min-width: 130px;
  }

  &:first-child {
    margin-left: 0;
  }
`;

export const Created = styled.p`
  margin-left: auto;
  width: max-content;
  font-weight: 500;
  font-size: 18px;
  line-height: 1;
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
