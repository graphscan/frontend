import styled from "styled-components";
import { Container as LayoutContainer } from "../../../components/common/container/container.styled";
import { TextButton } from "../../../components/common/text-button/text-button.styled";

const inputWidth = {
  2560: "665px",
  1920: "585px",
  1440: "525px",
  1280: "500px",
};

export const Wrapper = styled.header`
  padding: 31px 0;
  width: 100%;

  @media (max-width: 1920px) {
    padding: 30px 0;
  }

  @media (max-width: 1440px) {
    padding: 29px 0;
  }

  @media (max-width: 1280px) {
    padding: 28px 0;
  }
`;

export const Container = styled(LayoutContainer)`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 62px;
`;

export const Logo = styled.div`
  position: relative;
  margin: 0 0 -3px -15px;
  max-width: 221px;

  @media (max-width: 1280px) {
    margin-top: -4px;
  }
`;

export const Content = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(50% + ${inputWidth["2560"]} / 2);

  @media (max-width: 1920px) {
    width: calc(50% + ${inputWidth["1920"]} / 2);
  }

  @media (max-width: 1440px) {
    width: calc(50% + ${inputWidth["1440"]} / 2);
  }

  @media (max-width: 1280px) {
    width: calc(50% + ${inputWidth["1280"]} / 2);
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  margin: 0 20px;
  flex-basis: ${inputWidth["2560"]};
  height: 38px;
  font-size: 20px;

  @media (max-width: 1920px) {
    flex-basis: ${inputWidth["1920"]};
    height: 36px;
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    flex-basis: ${inputWidth["1440"]};
    height: 34px;
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    flex-basis: ${inputWidth["1280"]};
    height: 32px;
    font-size: 14px;
  }
`;

export const RightBlock = styled.section`
  display: grid;
  grid-template-columns: repeat(2, auto);
  align-items: center;
  gap: 65px;

  @media (max-width: 1920px) {
    gap: 55px;
  }

  @media (max-width: 1440px) {
    gap: 45px;
  }

  @media (max-width: 1280px) {
    gap: 35px;
  }
`;

export const HelpButton = styled(TextButton)`
  font-weight: 700;
  font-size: 20px;
  line-height: 1;

  @media (max-width: 1920px) {
    font-size: 18px;
  }

  @media (max-width: 1440px) {
    font-size: 16px;
  }

  @media (max-width: 1280px) {
    font-size: 14px;
  }
`;
