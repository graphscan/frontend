import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useControlledInput } from '../../../../../../utils/input.utils';
import { preventDefault } from '../../../../../../utils/events.utils';
import { Wrapper, StyledInput, Button, CleanButtonContainer } from './input.styled';

type Props = {
  placeholder: string;
  input: string;
  all: number;
  disabled: boolean;
  setInput: (input: string) => void;
};

export const Input: React.FC<Props> = ({ placeholder, input, all, setInput, disabled }) => {
  const { currentValue, setCurrentValue, CleanInputButton } = useControlledInput(input);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setInput(currentValue);
  }, [currentValue, setInput]);

  const toggleFocus = useCallback(() => setIsFocused((prevState) => !prevState), []);

  const handleClick = () => {
    setCurrentValue(String(all));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (!/^(?!0\d)\d*(\.\d*?)?$/.test(input)) {
      return;
    }

    if (Number(input) > all) {
      setCurrentValue(String(all));
      return;
    }

    setCurrentValue(e.target.value);
  };

  const handleBlur = () => {
    toggleFocus();
    if (currentValue.length > 0 && Number.isFinite(Number(currentValue))) {
      setCurrentValue(String(parseFloat(currentValue)));
    } else {
      setCurrentValue('');
    }
  };

  return (
    <Wrapper disabled={disabled} focused={isFocused}>
      <StyledInput
        onFocus={toggleFocus}
        disabled={disabled}
        value={currentValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
      {!disabled && <CleanButtonContainer>{CleanInputButton}</CleanButtonContainer>}
      <Button disabled={disabled} type="button" onClick={handleClick} onMouseDown={preventDefault}>
        All
      </Button>
    </Wrapper>
  );
};
