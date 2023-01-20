import styled from 'styled-components';
import { STICKY_SCROLL_CLASSNAME } from '../../../utils/table.utils';

export const LoadScreen = styled.div<{ spinnerTop: number }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  z-index: 100;

  svg {
    position: absolute;
    top: ${({ spinnerTop }) => `${spinnerTop}px`};
    left: 50%;
    width: 70px;
    height: 70px;
    transform: translate(-50%, -50%);

    @media (max-width: 1920px) {
      width: 60px;
      height: 60px;
    }

    @media (max-width: 1440px) {
      width: 50px;
      height: 50px;
    }

    @media (max-width: 1280px) {
      width: 40px;
      height: 40px;
    }
  }
`;

export const Wrapper = styled.section`
  position: relative;

  .ant-table {
    font-size: 18px;
    line-height: 1.05;
    box-sizing: border-box;
    position: relative;

    @media (max-width: 1920px) {
      font-size: 16px;
    }

    @media (max-width: 1440px) {
      font-size: 14px;
    }

    @media (max-width: 1280px) {
      font-size: 12px;
    }
  }

  .ant-table table {
    width: 100%;
    border-spacing: 0px;
  }

  .ant-table-thead {
    color: #859ec3;
  }

  .ant-table-body {
    overflow-x: auto;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;

    ::-webkit-scrollbar {
      height: 20px;

      @media (max-width: 1440px) {
        height: 18px;
      }

      @media (max-width: 1280px) {
        height: 16px;
      }
    }

    ::-webkit-scrollbar-track {
      background: #192434;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
    }

    ::-webkit-scrollbar-thumb {
      background: #243855;
      border: 6px solid #192434;
      border-radius: 10px;

      @media (max-width: 1280px) {
        border: 5px solid #192434;
      }
    }

    scrollbar-color: #243855 #192434;
  }

  .ant-table .ant-table-cell {
    vertical-align: middle;
    background-color: #192434;
    border-right: 2px solid #24354e;

    @media (max-width: 1280px) {
      border-width: 1px;
    }

    &:last-child {
      border-right: none;
    }

    &_sorted {
      color: #fff;

      .ant-table-sort-icon {
        display: block;
      }

      &_desc {
        .ant-table-sort-icon {
          display: block;
          top: auto;
          bottom: 5px;
          transform: translateX(-50%);
        }
      }
    }

    &.ant-table-cell-fix-left {
      z-index: 2;
    }
  }

  .ant-table th {
    position: sticky;
    padding: 28px 10px;
    text-align: center;
    border-top: 2px solid #24354e;
    border-bottom: 2px solid #24354e;
    text-overflow: ellipsis;
    cursor: pointer;

    @media (max-width: 1920px) {
      padding: 24px 10px;
    }

    @media (max-width: 1440px) {
      padding: 20px 10px;
    }

    @media (max-width: 1280px) {
      padding: 18px 10px;
      border-width: 1px;
    }
  }

  .ant-table td {
    position: relative;
    padding: 14px 10px;
    text-align: right;
    font-weight: 500;
    color: #758aa9;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: default;

    @media (max-width: 1920px) {
      padding: 12px 10px;
    }

    @media (max-width: 1440px) {
      padding: 10px 10px;
    }

    @media (max-width: 1280px) {
      padding: 8px 10px;
    }

    &:first-child {
      text-align: left;
    }

    &.ant-table-cell {
      &_with-link {
        color: #3e7cf4;

        &:hover {
          color: #3b73df;
        }

        &:active {
          color: #3269d2;
        }
      }

      &_row-hovered {
        background-color: #243855;
      }

      &_left-aligned {
        text-align: left;
      }

      &_button-container {
        height: 55px;

        @media (max-width: 1920px) {
          height: 49px;
        }

        @media (max-width: 1440px) {
          height: 42px;
        }

        @media (max-width: 1280px) {
          height: 46px;
        }
      }
    }

    .ant-table-cell-monospaced-value {
      font-family: 'Roboto Mono', 'Courier New', monospace;
    }

    .ant-table-cell-normal-font-value {
      font-family: 'Montserrat', 'Arial', sans-serif;
    }
  }

  .ant-table a {
    font-family: 'Roboto Mono', 'Courier New', monospace;
    font-weight: 500;
    font-size: 18px;
    color: #3e7cf4;
    text-decoration: none;
    outline: none;
    transition: color 0.2s;

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

    &:active {
      color: #3269d2;
    }
  }

  .ant-table img {
    margin: 0 auto;
  }

  .ant-table-column-title-container {
    display: grid;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 24px;
  }

  .ant-table-column-title {
    padding-bottom: 1px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    font-weight: 500;
    width: 100%;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .ant-table-sort-icon {
    display: none;
    position: absolute;
    top: 5px;
    left: 50%;
    transform: scaleY(-1) translateX(-50%);
    transition: transform 0.3s;

    div {
      width: 14px;
      height: 10px;

      @media (max-width: 1920px) {
        width: 13px;
        height: 9px;
      }

      @media (max-width: 1440px) {
        width: 12px;
        height: 8px;
      }

      @media (max-width: 1280px) {
        width: 11px;
        height: 7px;
      }
    }
  }

  .ant-table .ant-table-column {
    &_sorted {
      color: #fff;
      background-color: #1b283b;
    }
  }

  .ant-table-row {
    &:last-of-type {
      td {
        border-bottom: 2px solid #24354e;

        @media (max-width: 1280px) {
          border-bottom-width: 1px;
        }
      }
    }
  }

  .ant-table-sticky-holder {
    position: sticky;
    z-index: 3;
  }
  .${STICKY_SCROLL_CLASSNAME} {
    height: 20px !important;
    position: sticky;
    bottom: 0;
    z-index: 3;
    display: -webkit-box;
    display: flex;
    align-items: center;
    background: #192434;
    border-top: 1px solid #192434;

    @media (max-width: 1440px) {
      height: 18px !important;
    }

    @media (max-width: 1280px) {
      height: 16px !important;
    }

    &:hover {
      transform-origin: center bottom;
    }

    &:after {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #24354e;
      transform: translateY(-100%);

      @media (max-width: 1280px) {
        height: 1px;
      }
    }
  }

  .ant-table-sticky-scroll-bar {
    height: 100%;
    background-color: #243855;
    border: 6px solid #192434;
    border-radius: 10px;

    @media (max-width: 1280px) {
      border: 5px solid #192434;
    }
  }
`;
