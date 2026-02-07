import styled from "styled-components";

export const InputContainer = styled.div<{ $focused: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: ${({ $focused }) => ($focused ? "#203451" : "#243855")};
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover,
  &:focus {
    background-color: #203451;
  }
`;

export const Input = styled.input`
  padding: 0 0 0 16px;
  width: 100%;
  height: 100%;
  font-weight: 600;
  line-height: 1;
  color: #fff;
  border: none;
  outline: none;
  background-color: transparent;

  &::placeholder {
    font-weight: 500;
    color: #6a82a6;
  }
`;

export const InputButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
`;

export const InputCleanButtonContainer = styled.div`
  display: flex;
  align-items: center;
  width: max-content;
  height: 100%;
`;
