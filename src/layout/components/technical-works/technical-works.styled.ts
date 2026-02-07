import styled from "styled-components";

export const Container = styled.section`
  display: flex;
  justify-content: center;
  flex-grow: 1;
`;

export const Content = styled.section`
  position: relative;
  align-self: center;
  text-align: center;
`;

export const Image = styled.div`
  margin-bottom: 18px;
  display: flex;
  justify-content: center;
`;

export const Description = styled.p`
  font-size: 24px;
  line-height: 1.2;
  font-weight: bold;

  @media (max-width: 1920px) {
    font-size: 22px;
  }

  @media (max-width: 1440px) {
    font-size: 20px;
  }

  @media (max-width: 1280px) {
    font-size: 18px;
  }
`;
