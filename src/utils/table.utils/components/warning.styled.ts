import styled from "styled-components";

export const WarningContainer = styled.span<{
  $exclamation: boolean;
  $isNew: boolean;
}>`
  position: relative;
  margin-left: ${({ $exclamation, $isNew }) =>
    $exclamation && $isNew ? "54px" : $exclamation || $isNew ? "24px" : "0"};

  @media (max-width: 1920px) {
    margin-left: ${({ $exclamation, $isNew }) =>
      $exclamation && $isNew ? "52px" : $exclamation || $isNew ? "22px" : "0"};
  }

  @media (max-width: 1440px) {
    margin-left: ${({ $exclamation, $isNew }) =>
      $exclamation && $isNew ? "50px" : $exclamation || $isNew ? "20px" : "0"};
  }

  @media (max-width: 1280px) {
    margin-left: ${({ $exclamation, $isNew }) =>
      $exclamation && $isNew ? "48px" : $exclamation || $isNew ? "18px" : "0"};
  }
`;

export const Warning = styled.div`
  position: absolute;
  top: calc(50% + 2px);
  left: 0;
  transform: translate(-95%, -50%);
`;
