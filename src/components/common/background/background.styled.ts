import styled from "styled-components";

export const Background = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #1a2637;
  border-radius: 6px;
`;

export const PreloaderBackground = styled(Background)`
  svg {
    width: 70px;
    height: 70px;

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
