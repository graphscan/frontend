import styled from "styled-components";

export const Wrapper = styled.label<{ checked: boolean }>`
  margin-bottom: 18px;
  position: relative;
  display: flex;
  align-items: center;
  outline: none;
  pointer-events: ${({ checked }) => (checked ? "none" : "auto")};
  cursor: pointer;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover,
  &:focus {
    .account {
      color: #ccd7e7;
    }
  }

  &:active {
    .account {
      color: #a8bbd4;
    }
  }
`;

export const Button = styled.span<{ checked: boolean }>`
  margin-right: 10px;
  position: relative;
  width: 22px;
  height: 22px;
  background-color: #3b5170;
  border-radius: 50%;

  &:after {
    content: "";
    position: absolute;
    display: ${({ checked }) => (checked ? "block" : "none")};
    top: 50%;
    left: 50%;
    width: 16px;
    height: 16px;
    background: #3e7cf4;
    box-shadow: 0px 1px 10px rgba(62, 124, 244, 0.6);
    border-radius: 50%;
    transform: translate(-50%, -50%);

    @media (max-width: 1920px) {
      width: 14px;
      height: 14px;
    }

    @media (max-width: 1440px) {
      width: 12px;
      height: 12px;
    }

    @media (max-width: 1280px) {
      width: 10px;
      height: 10px;
    }
  }

  @media (max-width: 1920px) {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 1440px) {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 1280px) {
    width: 16px;
    height: 16px;
  }
`;

export const Label = styled.div``;

export const Description = styled.p`
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 18px;
  line-height: 1;
  color: #859ec3;

  @media (max-width: 1920px) {
    font-size: 16px;
  }

  @media (max-width: 1440px) {
    font-size: 14px;
  }

  @media (max-width: 1280px) {
    font-size: 12px;
  }
`;

export const Account = styled.p`
  font-weight: bold;
  font-size: 22px;
  line-height: 1;
  color: #fff;
  transition: color 0.2s;

  @media (max-width: 1920px) {
    font-size: 20px;
  }

  @media (max-width: 1440px) {
    font-size: 18px;
  }

  @media (max-width: 1280px) {
    font-size: 16px;
  }
`;

export const Input = styled.input`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
  cursor: pointer;
`;
