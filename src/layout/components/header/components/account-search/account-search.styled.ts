import styled from "styled-components";
import {
  InputContainer as InputContainerMixin,
  Input,
  InputButton,
  InputCleanButtonContainer,
} from "../../../../../components/common/input/input.styled";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 10;
`;

export const InputContainer = styled(InputContainerMixin)<{
  $hasResults: boolean;
}>`
  ${({ $focused, $hasResults }) =>
    $focused && $hasResults
      ? "border-bottom-left-radius: 0 !important; border-bottom-right-radius: 0 !important;"
      : ""}
`;

export const StyledInput = styled(Input)`
  flex-grow: 1;
`;

export const Button = styled(InputButton)`
  margin-right: 3px;

  img,
  svg {
    width: 18px;
    height: 20px;

    @media (max-width: 1920px) {
      width: 16px;
      height: 18px;
    }

    @media (max-width: 1440px) {
      width: 14px;
      height: 15px;
    }

    @media (max-width: 1280px) {
      width: 12px;
      height: 13px;
    }
  }
`;

export const CleanButtonContainer = styled(InputCleanButtonContainer)`
  margin: 0 8px;

  img {
    width: 18px;
    height: 18px;

    @media (max-width: 1920px) {
      width: 16px;
      height: 16px;
    }

    @media (max-width: 1440px) {
      width: 14px;
      height: 14px;
    }

    @media (max-width: 1280px) {
      width: 12px;
      height: 12px;
    }
  }
`;

export const SearchResults = styled.ul`
  padding: 6px 0;
  position: absolute;
  right: 0;
  left: 0;
  line-height: 1;
  background-color: #203451;
  border-top: 2px solid #3b5170;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;

  @media (max-width: 1280px) {
    border-width: 1px;
  }
`;

export const AccountLink = styled.a`
  padding: 8px 15px;
  display: inline-block;
  width: 100%;
  height: 100%;
  font-family: "Roboto Mono", "Courier New", monospace;
  font-weight: 500;
  line-height: 1;
  color: #859ec3;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  &:hover {
    background-color: #3b5170;
    font-weight: 600;
    color: #b7c8e2;
  }
`;

export const LockContracts = styled.ul`
  line-height: 1;
`;

export const LockContractLink = styled(AccountLink)`
  padding-left: 40px;
`;
