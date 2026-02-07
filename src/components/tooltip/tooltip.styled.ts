import styled from "styled-components";

export const StyledTooltip = styled.span`
  .tooltip,
  .title-description,
  .monospaced-tooltip {
    padding: 10px;
    font-weight: 500;
    font-size: 18px;
    line-height: 1.3;
    box-shadow:
      0px 2px 4px rgba(0, 0, 0, 0.05),
      0px 1px 40px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    pointer-events: auto;
    z-index: 1000;

    @media (max-width: 1920px) {
      font-size: 16px;
    }

    @media (max-width: 1440px) {
      font-size: 14px;
    }

    @media (max-width: 1280px) {
      font-size: 12px;
    }

    &:hover {
      visibility: visible;
      opacity: 1;
    }

    &.place-top {
      margin-top: -5px;
    }

    &.place-bottom {
      margin-top: 5px;
    }

    &.place-left,
    &.place-right {
      margin-top: 0px;
    }

    &.show {
      opacity: 1;
    }

    .tooltip-grid {
      display: grid;
      grid-template-columns: repeat(2, auto);
      gap: 18px;

      @media (max-width: 1920px) {
        gap: 16px;
      }

      @media (max-width: 1440px) {
        gap: 14px;
      }

      @media (max-width: 1280px) {
        gap: 12px;
      }

      &_with-note {
        margin-bottom: 10px;
      }

      &__title {
        margin-bottom: 10px;
        font-size: 20px;
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
    }

    .tooltip-title {
      margin-bottom: 10px;
      font-size: 20px;
      font-weight: 600;
      color: #859ec3;

      @media (max-width: 1920px) {
        margin-bottom: 8px;
        font-size: 18px;
      }

      @media (max-width: 1440px) {
        margin-bottom: 6px;
        font-size: 16px;
      }

      @media (max-width: 1280px) {
        margin-bottom: 4px;
        font-size: 14px;
      }
    }

    .tooltip-note {
      font-size: 26px;
      color: #859ec3;

      @media (max-width: 1920px) {
        font-size: 14px;
      }

      @media (max-width: 1440px) {
        font-size: 12px;
      }

      @media (max-width: 1280px) {
        font-size: 10px;
      }
    }

    a {
      color: #3e7cf4;
      text-decoration-line: underline;
      transition: color 0.2s;

      &:hover {
        color: #3b73df;
      }

      &:active {
        color: #3269d2;
      }
    }
  }

  .title-description {
    max-width: 320px;

    @media (max-width: 1920px) {
      max-width: 300px;
    }

    @media (max-width: 1440px) {
      max-width: 280px;
    }

    @media (max-width: 1280px) {
      max-width: 260px;
    }
  }

  .monospaced-tooltip {
    font-family: "Roboto Mono", "Courier New", monospace;
    font-weight: 500;
  }
`;
