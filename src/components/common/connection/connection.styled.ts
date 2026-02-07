import styled from "styled-components";
import { TextButton } from "../text-button/text-button.styled";
import { GreyButton } from "../grey-button/grey-button.styled";

export const Container = styled.div`
  position: relative;
  font-weight: 600;
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

export const Button = styled(GreyButton)`
  padding: 8px 25px 8px 5px;
  display: flex;
  align-items: center;
  border-radius: 38px;

  @media (max-width: 1920px) {
    padding-top: 7px;
    padding-bottom: 7px;
  }

  @media (max-width: 1440px) {
    padding-top: 6px;
    padding-bottom: 6px;
  }

  @media (max-width: 1280px) {
    padding-top: 5px;
    padding-bottom: 5px;
  }
`;

export const Icon = styled.div`
  margin: 0 10px;
  width: 28px;
  height: 26px;

  @media (max-width: 1920px) {
    width: 26px;
    height: 24px;
  }

  @media (max-width: 1440px) {
    width: 24px;
    height: 22px;
  }

  @media (max-width: 1280px) {
    width: 22px;
    height: 20px;
  }

  img {
    width: 100%;
  }
`;

export const Connected = styled(TextButton)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: 232px;

  @media (max-width: 1920px) {
    min-width: 212px;
  }

  @media (max-width: 1440px) {
    min-width: 192px;
  }

  @media (max-width: 1280px) {
    min-width: 175px;
  }
`;

export const Userpick = styled.div`
  margin-left: -3px;
  margin-right: 12px;
`;

export const Triangle = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 6px 6px 6px;
  border-color: transparent transparent #243855;
  transform: translateX(-50%);
`;

export const Menu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 12px);
  background-color: #243855;
  box-shadow:
    0px 2px 4px rgba(0, 0, 0, 0.05),
    0px 1px 40px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  z-index: 10;
`;

export const MenuHeader = styled.header`
  padding: 16px 32px 16px 12px;
  display: flex;
  border-bottom: 2px solid #384d6c;

  @media (max-width: 1280px) {
    border-width: 1px;
  }
`;

export const MenuBody = styled.section`
  padding: 18px 25px;
  border-bottom: 2px solid #384d6c;

  @media (max-width: 1280px) {
    border-width: 1px;
  }
`;

export const MenuFooter = styled.footer`
  padding: 17px 15px;
`;

export const MenuUserpick = styled.div`
  margin-right: 8px;
  width: max-content;

  &:hover {
    & + section a {
      color: #ccd7e7;
    }
  }

  &:active {
    & + section a {
      color: #a8bbd4;
    }
  }

  a {
    cursor: pointer;
  }
`;

export const Heading = styled.h2`
  margin-bottom: 6px;
  min-width: 197px;
  font-weight: bold;
  font-size: 22px;
  line-height: 1;

  @media (max-width: 1920px) {
    min-width: 180px;
    font-size: 20px;
  }

  @media (max-width: 1440px) {
    min-width: 162px;
    font-size: 18px;
  }

  @media (max-width: 1280px) {
    min-width: 145px;
    font-size: 16px;
  }

  a {
    color: #fff;
    text-decoration: underline;
    outline: none;
    transition: 0.2s;

    &:hover,
    &:focus {
      color: #ccd7e7;
    }

    &:active {
      color: #a8bbd4;
    }
  }
`;

export const Disconnect = styled(TextButton)`
  text-decoration: none;
  font-weight: bold;
`;

export const SpinnerContainer = styled.div`
  margin: 0 auto;
  width: 30px;
  height: 30px;

  @media (max-width: 1920px) {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 1440px) {
    width: 26px;
    height: 26px;
  }

  @media (max-width: 1280px) {
    width: 24px;
    height: 24px;
  }

  svg {
    width: 100%;
    height: 100%;
  }
`;
