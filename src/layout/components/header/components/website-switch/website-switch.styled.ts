import styled, { css } from 'styled-components';

export const StyledWebsiteSwitch = styled.article`
  position: relative;
  margin: 0 auto 0 20px;

  .website-switch-button {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 38px;
    min-height: 38px;
    cursor: pointer;
    border: none;
    border-radius: 6px;
    outline: none;
    background: #1c2839;
    transition: opacity 0.2s;

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

    &:hover,
    &:focus {
      opacity: 0.85;
    }

    &:active {
      opacity: 0.7;
    }
  }

  .website-switch-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    box-shadow: 0px 3px 16px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    z-index: 50;
  }

  .website-switch-link {
    padding-right: 8px;
    display: inline-flex;
    align-items: center;
    width: 100%;
    height: 100%;
    text-decoration: none;
    cursor: pointer;
  }

  .website-switch-menu-text {
    font-weight: 500;
    font-size: 14px;
    line-height: 1;
    color: #859ec3;
    white-space: nowrap;
    text-transform: capitalize;

    @media (max-width: 1440px) {
      font-size: 12px;
    }
  }

  .website-switch-menu-item-icon {
    min-width: 38px;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: 1440px) {
      min-width: 34px;
    }
  }
`;

export const WebsiteSwitchMenuItem = styled.li<{ isActive: boolean }>`
  display: flex;
  height: 36px;
  background-color: #1c2839;
  border-bottom: 1px solid #2f4362;
  transition: background-color 0.2s;

  ${(p) =>
    p.isActive
      ? css`
          background-color: #243855;
          pointer-events: none;
        `
      : ''}

  &:hover,
  &:focus {
    background-color: #203451;
  }

  &:active {
    background-color: #243855;
  }

  &:first-of-type {
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
  }

  &:last-of-type {
    height: 35px;
    border-bottom: none;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
`;
