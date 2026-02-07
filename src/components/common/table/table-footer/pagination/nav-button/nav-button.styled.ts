import styled from "styled-components";

export const Button = styled.button`
  margin-right: 8px;
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  flex-shrink: 0;
  padding: 0;
  box-shadow: ${({ disabled }) =>
    disabled ? "none" : "0px 2px 8px rgba(62, 124, 244, 0.3)"};
  border: none;
  border-radius: 50%;
  background-color: transparent;
  outline: none;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};

  &:last-of-type {
    margin-right: 0;
  }

  &:hover,
  &:focus {
    svg {
      fill: ${({ disabled }) => (disabled ? "none" : "#3673ea")};
    }
    rect {
      stroke: ${({ disabled }) => (disabled ? "#3b5170" : "#3673ea")};
    }
  }

  &:active {
    svg {
      fill: ${({ disabled }) => (disabled ? "none" : "#3269D3")};
    }
    rect {
      stroke: ${({ disabled }) => (disabled ? "#3b5170" : "#3269D3")};
    }
  }

  @media (max-width: 1920px) {
    width: 22px;
    height: 22px;
    min-width: 22px;
    min-height: 22px;
  }

  @media (max-width: 1440px) {
    width: 20px;
    height: 20px;
    min-width: 20px;
    min-height: 20px;
  }

  @media (max-width: 1280px) {
    width: 18px;
    height: 18px;
    min-width: 18px;
    min-height: 18px;
  }

  svg {
    display: block;
    width: 100%;
    height: 100%;
    fill: ${({ disabled }) => (disabled ? "none" : "#3e7cf4")};
    transform: scaleX(
      ${(props) => (props["aria-label"] === "previous" ? "1" : "-1")}
    );
    transition: fill 0.2s;
  }

  rect {
    stroke: ${({ disabled }) => (disabled ? "#3b5170" : "#3e7cf4")};
    transition: stroke 0.2s;
  }
  line {
    stroke: ${({ disabled }) => (disabled ? "#3b5170" : "#fff")};
    transition: stroke 0.2s;
  }
`;
