import styled from 'styled-components';

export const Wrapper = styled.div`
  margin: 0 6px 0 12px;

  input {
    padding: 1px 8px;
    min-width: 53px;
    text-align: center;
    font-size: 18px !important;
    color: #fff;
    letter-spacing: 0.2em;
    background-color: #243855;
    border: none;
    border-radius: 4px;
    outline: none;
    transition: 0.2s;

    &:hover,
    &:focus {
      background-color: #203451;
    }

    @media (max-width: 1920px) {
      padding: 1px 8px;
      min-width: 48px;
      font-size: 16px !important;
    }

    @media (max-width: 1440px) {
      padding: 2px 8px;
      min-width: 43px;
      font-size: 14px !important;
    }

    @media (max-width: 1280px) {
      padding: 2px 8px;
      min-width: 37px;
      font-size: 12px !important;
    }
  }
`;
