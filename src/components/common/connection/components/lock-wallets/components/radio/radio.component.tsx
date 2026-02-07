import { useRef, ChangeEvent, KeyboardEvent } from "react";
import { clampMiddle } from "../../../../../../../utils/text.utils";
import {
  Wrapper,
  Input,
  Button,
  Label,
  Description,
  Account,
} from "./radio.styled";

type Props = {
  id: string;
  name: string;
  label: "Account" | "Vesting contract";
  currentChecked: string | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const Radio: React.FC<Props> = ({
  id,
  name,
  label,
  currentChecked,
  onChange,
}) => {
  const checked = id === currentChecked;
  const ref = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === "Enter" && ref.current) {
      ref.current.click();
    }
  };

  return (
    <Wrapper
      role="radio"
      aria-checked={checked}
      checked={checked}
      tabIndex={0}
      onKeyPress={handleKeyPress}
    >
      <Input
        onChange={onChange}
        ref={ref}
        type="radio"
        name={name}
        value={id}
        tabIndex={-1}
        checked={checked}
      />
      <Button checked={checked} />
      <Label>
        <Description>{label}</Description>
        <Account className="account">{clampMiddle(id)}</Account>
      </Label>
    </Wrapper>
  );
};
