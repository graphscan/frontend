import styled, { css } from 'styled-components';

export const Tabs = styled.section`
  position: relative;
  padding: 18px 16px 18px 28px;
  display: flex;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background-color: #1c2839;
`;

export const TabButton = styled.a<{ active: boolean }>`
  margin-left: 12px;
  padding: 7px 14px 8px;
  font-size: 20px;
  line-height: 1.14;
  border-radius: 5px;
  text-decoration: none;
  outline: none;
  transition: 0.2s;
  ${(p) =>
    p.active
      ? css`
          font-weight: bold;
          color: #fff;
          background-color: #f86342;
          box-shadow: 0px 3px 16px rgba(248, 99, 66, 0.3);
          pointer-events: none;
        `
      : css`
          font-weight: 500;
          color: #859ec3;
          background-color: #243855;
          cursor: pointer;

          &:hover,
          &:focus {
            background-color: #203451;
          }

          &:active {
            background-color: #1a2f4d;
          }
        `}

  @media (max-width: 1920px) {
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
  }

  &:first-of-type {
    margin-left: 0;
  }
`;

export const TabContent = styled.article<{ footerPressedToBottom?: boolean }>`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: ${(p) => (p.footerPressedToBottom ? 'space-between' : 'flex-start')};
  width: 100%;
  height: 100%;
`;
