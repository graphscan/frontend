import { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { useControlledInput } from '../../../../../../../../../../utils/input.utils';
import { Wrapper, StyledInput, CleanButtonContainer } from './calculator-input.styled';

type Props = {
  disabled?: boolean;
  placeholder: string;
  defaultInput: string;
  setInput: (input: string) => void;
};

export const CalculatorInput: React.FC<Props> = ({ disabled, placeholder, defaultInput, setInput }) => {
  const [isFocused, setIsFocused] = useState(false);
  const { currentValue, setCurrentValue, CleanInputButton } = useControlledInput(defaultInput);

  useEffect(() => {
    setInput(currentValue);
  }, [currentValue, setInput]);

  const toggleFocus = useCallback(() => setIsFocused((prevState) => !prevState), []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (!/^\d*(\.\d*)?$/.test(String(input))) {
      return;
    }

    setCurrentValue(e.target.value);
  };

  return (
    <Wrapper disabled={Boolean(disabled)} focused={isFocused}>
      <StyledInput
        disabled={disabled}
        onFocus={toggleFocus}
        onBlur={toggleFocus}
        value={currentValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <CleanButtonContainer>{CleanInputButton}</CleanButtonContainer>
    </Wrapper>
  );
};
