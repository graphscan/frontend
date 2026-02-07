import styled from "styled-components";

export const GreyButton = styled.button`
  color: #fff;
  background-color: #3b5170;
  border: none;
  outline: none;
  cursor: pointer;
  transition: 0.2s;

  &:hover,
  &:focus {
    background-color: #344967;
  }

  &:active {
    background-color: #283a53;
  }
`;
