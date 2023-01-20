import styled from 'styled-components';
import { Link } from '../../../../../components/common/link/link.styled';
import { DescriptionBlock } from '../../../../../components/common/description-block/description-block.styled';

export const Container = styled.article`
  max-width: 1164px;

  @media (max-width: 1920px) {
    max-width: 1084px;
  }

  @media (max-width: 1440px) {
    max-width: 1024px;
  }

  @media (max-width: 1280px) {
    max-width: 964px;
    min-width: 856px;
  }
`;

export const Title = styled.h1`
  margin-bottom: 14px;
`;

export const TitleLink = styled.a`
  display: flex;
  align-items: center;
  width: fit-content;
  font-weight: bold;
  font-size: 30px;
  line-height: 1;
  color: #fff;
  text-decoration: none;
  outline: none;
  transition: 0.2s;

  @media (max-width: 1920px) {
    font-size: 28px;
  }

  @media (max-width: 1440px) {
    font-size: 26px;
  }

  @media (max-width: 1280px) {
    font-size: 24px;
  }

  &:hover,
  &:focus {
    color: #ccd7e7;

    svg {
      path,
      circle {
        fill: #ccd7e7;
      }
    }
  }

  &:active {
    color: #a8bbd4;

    svg {
      path,
      circle {
        fill: #a8bbd4;
      }
    }
  }

  svg {
    path,
    circle {
      transition: fill 0.2s;
    }
  }
`;

export const GraphIconContainer = styled.div`
  margin-right: 10px;
  width: 34px;
  height: 42px;

  @media (max-width: 1920px) {
    width: 33px;
    height: 41px;
  }

  @media (max-width: 1440px) {
    width: 32px;
    height: 40px;
  }

  @media (max-width: 1280px) {
    width: 31px;
    height: 39px;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const ArrowIconContainer = styled.div`
  margin-left: 2px;
  display: flex;
  flex-direction: column;
  align-self: flex-start;

  svg {
    margin-top: 7px;
    width: 11px;
    height: 11px;

    @media (max-width: 1920px) {
      width: 10px;
      height: 10px;
    }

    @media (max-width: 1440px) {
      width: 9px;
      height: 9px;
    }

    @media (max-width: 1280px) {
      width: 8px;
      height: 8px;
    }
  }
`;

export const Text = styled.p`
  margin-bottom: 32px;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.21;
  color: #fff;

  @media (max-width: 1920px) {
    font-size: 16px;
  }

  @media (max-width: 1440px) {
    font-size: 14px;
  }

  @media (max-width: 1280px) {
    font-size: 12px;
  }

  &:last-of-type {
    margin-bottom: 14px;
  }
`;

export const Anchor = styled(Link)<{ icon?: boolean }>`
  display: inline-flex;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  text-decoration-line: ${({ icon }) => (icon ? 'none' : 'underline')};
  color: #4d9fff;

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
    color: #3b73df;

    p {
      color: #a3b7d6;
    }

    path {
      fill: #a3b7d6;
    }
  }

  &:active {
    p {
      color: #d7e3f4;
    }

    path {
      fill: #d7e3f4;
    }
  }
`;

export const Info = styled.div`
  width: 100%;
  max-width: 678px;

  @media (max-width: 1920px) {
    max-width: 600px;
  }

  @media (max-width: 1440px) {
    max-width: 525px;
  }

  @media (max-width: 1280px) {
    max-width: 450px;
  }
`;

export const ListContainer = styled(DescriptionBlock)`
  margin-bottom: 88px;
  padding: 20px;
  width: fit-content;
  background: #1f2d40;
  border-radius: 6px;
`;

export const ListItem = styled.li`
  margin-left: 20px;
  list-style-type: disc;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.83;
  font-feature-settings: 'case' on;
  color: #fff;

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

export const Heading = styled.h3`
  font-weight: bold;
  font-size: 20px;
  line-height: 1.21;
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

export const ColoredText = styled(Text)`
  margin-bottom: 20px;
  color: #859ec3;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Footer = styled.footer`
  position: relative;
  padding: 32px 0 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const Robot = styled.div`
  position: absolute;
  bottom: 100%;
  right: -32px;
  img {
    height: 500px;

    @media (max-width: 1920px) {
      height: 470px;
    }

    @media (max-width: 1440px) {
      height: 430px;
    }

    @media (max-width: 1280px) {
      height: 390px;
    }
  }
`;
