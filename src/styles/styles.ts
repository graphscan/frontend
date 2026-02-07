import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body,
  h1,
  h2,
  h3,
  h4,
  p,
  figure,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  ul,
  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  html:focus-within {
    scroll-behavior: smooth;
  }

  body {
    min-height: 100vh;
    text-rendering: optimizeSpeed;
    font-family: 'Montserrat', 'Arial', sans-serif;
    font-weight: normal;
    line-height: 1.5;
    color: #fff;
    background-color: #141d2b;

    @media (min-width: 960px) {
      margin-right: calc(100% - 100vw);
      overflow-x: hidden;
    }
  }

  a:not([class]) {
    text-decoration-skip-ink: auto;
  }

  img,
  picture {
    max-width: 100%;
    display: block;
    color: transparent;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  div#__next, div#__next > div {
    min-height: 100vh;
  }

  @media (prefers-reduced-motion: reduce) {
    html:focus-within {
      scroll-behavior: auto;
    }

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  ::-webkit-scrollbar {
    width: 15px;
    height: 15px;
  }

  ::-webkit-scrollbar-track {
    background: #192434;
  }

  ::-webkit-scrollbar-thumb {
    background: #243855;
    border: 4px solid #192434;
    border-radius: 10px;
  }

  html {
    scrollbar-color: #243855 #192434; 
  }
`;
