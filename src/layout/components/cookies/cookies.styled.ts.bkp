import styled, { css } from "styled-components";

export const cookiesBottomOffset = "46px";

export const descriptionTextStyles = css`
  font-family: "Montserrat", "Arial", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.2;
  color: #fff;
`;

const buttonStyles = css`
  padding: 0;
  background-color: transparent;
  border: none;
  transition: 0.2s;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    pointer-events: none;
  }

  &:not(:first-child) {
    @media (max-width: 480px) {
      margin-top: 28px;
    }
  }

  &_with-background {
    padding: 6px 24px;
    font-weight: 700;
    color: #fff;
    background-color: #4d9fff;
    border-radius: 48px;

    &:hover,
    &:focus {
      background-color: #3b73df;
    }
  }

  &_only-text {
    font-weight: 600;
    color: #4d9fff;

    &:hover,
    &:focus {
      color: #3b73df;
    }
  }
`;

export const CookiesContainer = styled.section<{ cookiesHeight: number }>`
  position: absolute;
  right: 30px;
  top: ${(p) => `calc(100vh - ${p.cookiesHeight}px - ${cookiesBottomOffset})`};
  height: ${(p) =>
    `calc(100% - 100vh + ${p.cookiesHeight}px + ${cookiesBottomOffset})`};
`;

export const StyledCookies = styled.article<{ selfHeight: number }>`
  position: sticky;
  top: ${(p) => `calc(100vh - ${cookiesBottomOffset} - ${p.selfHeight}px)`};
  padding: 28px;
  width: 491px;
  background-color: #1a2637;
  box-shadow:
    0px 6px 6px rgba(0, 0, 0, 0.05),
    0px 2px 2px rgba(0, 0, 0, 0.08),
    inset 0px 1px 1px #253450;
  border-radius: 6px;
  z-index: 100;

  @media (max-width: 768px) {
    position: fixed;
    padding: 18px;
    max-width: calc(100% - 32px);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .cookies-title {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 18px;
    color: #fff;

    svg {
      margin-right: 12px;
    }
  }

  .cookies-description {
    margin-bottom: 24px;
    ${descriptionTextStyles}

    @media (max-width: 480px) {
      margin-bottom: 36px;
    }

    a {
      font-weight: 700;
      color: #4d9fff;
      text-decoration: none;
      transition: color 0.2s;

      &:hover,
      &:focus {
        color: #3b73df;
      }
    }
  }

  .cookies-buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }

  .cookies-button {
    ${buttonStyles}

    &_with-background {
      font-size: 14px;
    }

    &_only-text {
      font-size: 12px;
    }
  }
`;

export const CookiesModalContent = styled.section`
  max-width: 539px;

  .cookies-modal-content-title {
    margin-bottom: 16px;
    font-weight: 700;
    font-size: 18px;
    color: #fff;

    @media (max-width: 768px) {
      margin-bottom: 10px;
    }
  }

  .cookies-modal-content-description {
    margin-bottom: 28px;
    ${descriptionTextStyles}
    font-size: 16px;
    line-height: 1.25;

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }

  .cookies-modal-content-options-container {
    margin-bottom: 32px;

    @media (max-width: 768px) {
      margin: 24px -16px;
    }
  }

  .cookies-modal-content-options {
    background-color: #1c2839;
    box-shadow:
      0px 0px 4px rgba(0, 28, 69, 0.05),
      0px 6px 20px rgba(0, 25, 63, 0.06);
    border-radius: 16px;

    @media (max-width: 768px) {
      background-color: transparent;
      box-shadow: none;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 0;
    }
  }

  .cookies-modal-content-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cookies-modal-content-button {
    ${buttonStyles}
    font-size: 16px;

    &:first-child:not(:only-child) {
      margin-right: 50px;
    }
  }
`;
