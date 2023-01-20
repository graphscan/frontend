import Select from 'react-select';
import styled from 'styled-components';

export const StyledSelect = styled(Select)`
  .react-select {
    &__control {
      height: 38px;
      min-height: 32px;
      background-color: #243855;
      border: none;
      border-radius: 4px;
      box-shadow: none;
      cursor: pointer;

      @media (max-width: 1920px) {
        height: 36px;
      }

      @media (max-width: 1440px) {
        height: 34px;
      }

      @media (max-width: 1280px) {
        height: 32px;
      }

      &--menu-is-open {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;

        .react-select__indicator {
          transform: rotate(-180deg);
        }
      }
    }

    &__value-container {
      margin-left: 10px;
      padding: 0;
      height: 100%;
    }

    &__placeholder {
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
    }

    &__single-value {
      font-weight: 600;
      font-size: 20px;
      line-height: 1.2;
      color: #b7c8e2;

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

    &__indicator-separator {
      display: none;
    }

    &__indicator {
      color: #fff;
      transition: 0.2s;

      &:hover {
        color: #fff;
      }
    }

    &__menu {
      margin: 0;
      background: #243855;
      border-top: 2px solid #3b5170;
      border-radius: 4px;
      border-top-right-radius: 0;
      border-top-left-radius: 0;

      @media (max-width: 1280px) {
        border-top-width: 1px;
      }
    }

    &__option {
      font-weight: 500;
      font-size: 20px;
      line-height: 1;
      color: #859ec3;
      background-color: transparent;
      cursor: pointer;
      white-space: nowrap;

      @media (max-width: 1920px) {
        font-size: 18px;
      }

      @media (max-width: 1440px) {
        font-size: 16px;
      }

      @media (max-width: 1280px) {
        font-size: 14px;
      }

      &:hover {
        font-weight: 600;
        color: #b7c8e2;
        background-color: #3b5170;
      }

      &--is-selected {
        font-weight: 600;
        color: #b7c8e2;
      }
    }
  }
`;
