import styled from "styled-components";

export const Partners = styled.article`
  .partners-top-content {
    margin-bottom: 12px;
  }

  .partners-section {
    display: flex;
    font-family: "Montserrat";
    font-weight: 500;
    font-size: 12px;
    line-height: 1.2;
    color: #ffffff;
  }

  .partners-icon-box {
    margin: -8px 0 0 -8px;
    display: flex;
    justify-content: center;
  }

  .partners-button {
    padding: 0;
    color: #5ba7ff;
    background-color: transparent;
    border: none;
    outline: none;
    cursor: pointer;
    transition: color 0.2s;

    &:hover,
    &:focus {
      color: #3b73df;
    }

    &:active {
      color: #3269d2;
    }
  }
`;
