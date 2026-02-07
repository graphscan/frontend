import { components } from "react-select";
import { Icon } from "./control.styled";

export const Control: typeof components.Control = ({ children, ...rest }) => (
  <components.Control {...rest}>
    <Icon>
      <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect y="6.36365" width="2.8" height="7.63636" rx="1" fill="#B7C8E2" />
        <rect x="5.6001" width="2.8" height="14" rx="1" fill="#B7C8E2" />
        <rect
          x="11.2002"
          y="2.54541"
          width="2.8"
          height="11.4545"
          rx="1"
          fill="#B7C8E2"
        />
      </svg>
    </Icon>
    {children}
  </components.Control>
);
