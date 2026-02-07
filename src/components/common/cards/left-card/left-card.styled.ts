import styled, { css } from "styled-components";
import { Link } from "../../link/link.styled";

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
  margin-right: ${({ warning }) => (warning ? "0" : "12px")};
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

export const Description = styled.section`
  flex-grow: 1;
`;

export const DescriptionRow = styled.section`
  margin-bottom: 4px;
  display: flex;
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Text = styled.p`
  font-weight: 500;
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

export const AccountLink = styled(Link)`
  font-weight: 500;
  font-size: 18px;
  line-height: 1;

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

export const Footer = styled.footer`
  display: flex;
`;

const buttonMarginLeft = css`
  margin-left: 32px;

  @media (max-width: 1920px) {
    margin-left: 26px;
  }

  @media (max-width: 1440px) {
    margin-left: 20px;
  }

  @media (max-width: 1280px) {
    margin-left: 14px;
  }
`;

export const ButtonWrapper = styled.div`
  ${buttonMarginLeft};
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

export const notificationIconClassName = "notification-button-icon";

export const NotificationButton = styled.button`
  ${buttonMarginLeft};
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 20px;
  line-height: 1.14;
  font-weight: 700;
  color: #fff;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  transition: 0.2s;

  &:hover,
  &:focus {
    color: #ccd7e7;

    ${`.${notificationIconClassName}`} {
      background-color: #3673ea;
    }
  }

  &:active {
    color: #a8bbd4;

    ${`.${notificationIconClassName}`} {
      background-color: #3269d3;
    }
  }

  &:only-child {
    margin-left: 0;
  }

  @media (max-width: 1920px) {
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
  }

  ${`.${notificationIconClassName}`} {
    margin-right: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 38px;
    min-height: 38px;
    background-color: #3e7cf4;
    box-shadow: 0px 6px 16px rgba(62, 124, 244, 0.26);
    border-radius: 34px;
    transition: background-color 0.2s;

    @media (max-width: 1920px) {
      min-width: 36px;
      min-height: 36px;
    }

    @media (max-width: 1440px) {
      min-width: 34px;
      min-height: 34px;
    }

    @media (max-width: 1280px) {
      min-width: 32px;
      min-height: 32px;
    }
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
