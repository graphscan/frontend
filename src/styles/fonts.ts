import { createGlobalStyle } from "styled-components";

export const Fonts = createGlobalStyle`
  @font-face {
    font-family: 'Montserrat';
    src: url(/fonts/montserrat-regular.woff2) format('woff2'),
      url(/fonts/montserrat-regular.woff) format('woff'),
      url(/fonts/montserrat-regular.ttf) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    src: url(/fonts/montserrat-light.woff2) format('woff2'), url(/fonts/montserrat-light.woff) format('woff'),
      url(/fonts/montserrat-light.ttf) format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    src: url(/fonts/montserrat-medium.woff2) format('woff2'),
      url(/fonts/montserrat-medium.woff) format('woff'), url(/fonts/montserrat-medium.ttf) format('truetype');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    src: url(/fonts/montserrat-semi-bold.woff2) format('woff2'),
      url(/fonts/montserrat-semi-bold.woff) format('woff'),
      url(/fonts/montserrat-semi-bold.ttf) format('truetype');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Montserrat';
    src: url(/fonts/montserrat-bold.woff2) format('woff2'), url(/fonts/montserrat-bold.woff) format('woff'),
      url(/fonts/montserrat-bold.ttf) format('truetype');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto Mono';
    src: url(/fonts/roboto-mono-medium.woff2) format('woff2'),
      url(/fonts/roboto-mono-medium.woff) format('woff'),
      url(/fonts/roboto-mono-medium.ttf) format('truetype');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'PT Sans';
    src: url('/fonts/pt-sans-400.woff2') format('woff2'),
    url('/fonts/pt-sans-400.woff') format('woff'),
    url('/fonts/pt-sans-400.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
`;
