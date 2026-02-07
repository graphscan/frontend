import styled from "styled-components";

export const Container = styled.span`
  display: inline-flex;
  align-items: center;
`;

export const NewIcon = styled.span`
  display: inline-block;
  width: 37px;
  height: 30px;

  @media (max-width: 1920px) {
    width: 35px;
    height: 28px;
  }

  @media (max-width: 1440px) {
    width: 33px;
    height: 26px;
  }

  @media (max-width: 1280px) {
    width: 31px;
    height: 24px;
  }

  img {
    width: 100%;
    height: 100%;
  }
`;

export const ExlamationIcon = styled.span<{
  $isNew: boolean;
  $exclamationSize: number;
}>`
  margin-left: ${({ $isNew }) => ($isNew ? "-8px" : "0")};
  display: inline-block;
  width: ${({ $exclamationSize }) => `${$exclamationSize}px`};
  height: ${({ $exclamationSize }) => `${$exclamationSize}px`};

  @media (max-width: 1920px) {
    width: ${({ $exclamationSize }) => `${$exclamationSize - 2}px`};
    height: ${({ $exclamationSize }) => `${$exclamationSize - 2}px`};
  }

  @media (max-width: 1440px) {
    width: ${({ $exclamationSize }) => `${$exclamationSize - 4}px`};
    height: ${({ $exclamationSize }) => `${$exclamationSize - 4}px`};
  }

  @media (max-width: 1280px) {
    width: ${({ $exclamationSize }) => `${$exclamationSize - 6}px`};
    height: ${({ $exclamationSize }) => `${$exclamationSize - 6}px`};
  }
`;
