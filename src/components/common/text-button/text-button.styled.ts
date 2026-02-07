import styled from "styled-components";

export const TextButton = styled.button`
  padding: 0;
  color: #fff;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  transition: 0.2s;

  &:hover,
  &:focus {
    color: #ccd7e7;
  }

  &:active {
    color: #a8bbd4;
  }
`;
