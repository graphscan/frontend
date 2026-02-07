import styled, { css } from "styled-components";
import { Link } from "../../../../../components/common/link/link.styled";

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

export const Text = styled.p`
  margin-bottom: 32px;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.32;
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

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Anchor = styled(Link)<{ icon?: boolean }>`
  display: inline-flex;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  color: #4d9fff;

  ${(p) =>
    p.icon
      ? css`
          text-decoration: none;
          vertical-align: middle;
          transition: opacity 0.2s;

          &:hover,
          &:focus {
            opacity: 0.75;
          }
        `
      : ""}

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
  }
`;

export const Nowrap = styled.span`
  white-space: nowrap;
`;

export const LeftSection = styled.section`
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
  flex-direction: row-reverse;
  align-items: center;
`;

export const Robot = styled.div`
  position: absolute;
  bottom: 100%;
  right: -20px;
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
