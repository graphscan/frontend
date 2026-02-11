import styled, { css } from "styled-components";

export const StyledCheckbox = styled.label<{ checked: boolean }>`
  position: relative;
  margin: 18.5px 0 24px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  height: 40px;
  background-color: #243855;
  border-radius: 4px;
  cursor: pointer;

  &:hover,
  &:focus {
    .checkbox-input {
      ${(p) =>
        p.checked
          ? css`
              background-color: #2967df;
              border-color: #2967df;
            `
          : css`
              border-width: 2px;
            `}
    }
  }

  .checkbox-input {
    position: relative;
    margin-right: 12px;
    min-width: 18px;
    min-height: 18px;
    background-color: #3b5170;
    border-radius: 2px;
    transition: 0.2s;

    ${(p) =>
      p.checked
        ? css`
            background-color: #4685ff;
            border-color: #4685ff;

            &:before {
              content: url("/images/checkmark.svg");
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          `
        : ""}
  }

  .checkbox-label {
    color: ${(p) => (p.checked ? "#fff" : "#b7c8e2")};
    font-weight: 600;
    font-size: 12px;
    line-height: 1.2;
  }

  .checkbox-label-content {
    margin-right: 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .checkbox-info-box {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
  }
`;
