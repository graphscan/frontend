import styled from "styled-components";

import { descriptionTextStyles } from "../cookies.styled";

export const StyledCookiesOption = styled.div<{ isExpanded: boolean }>`
  padding: 17px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 16px;
  }

  &:last-child {
    border-bottom-color: transparent;
  }

  .cookies-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .cookies-option-description {
    margin-top: 18px;
    ${descriptionTextStyles}
    line-height: 1.3;
  }

  .cookies-option-value {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .cookies-dropdown-arrow {
    margin-right: 12px;
    transition: 0.25s;
    transform: rotate(${(p) => (p.isExpanded ? "-180deg" : 0)});

    @media (max-width: 768px) {
      margin-right: 8px;
    }
  }

  .cookies-option-text {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.06em;
    color: #fff;
    whit-space: nowrap;

    @media (max-width: 768px) {
      font-size: 12px;
    }

    &_orange {
      color: #ff6e3f;
    }
  }
`;
