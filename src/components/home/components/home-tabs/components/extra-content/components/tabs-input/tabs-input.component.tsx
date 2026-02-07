import { useCallback, useState, KeyboardEvent, ChangeEvent } from "react";
import { observer } from "mobx-react-lite";
import { StyledInput, Button, CleanButtonContainer } from "./tabs-input.styled";
import { homeTabsViewModel } from "../../../../home-tabs.model";
import { InputContainer } from "../../../../../../../common/input/input.styled";
import { removeStickyScroll } from "../../../../../../../../utils/table.utils";
import { useControlledInput } from "../../../../../../../../utils/input.utils";

export const TabsInput: React.FC = observer(() => {
  const { searchTerm, placeholder, setSearchTerm } = homeTabsViewModel;

  const { currentValue, setCurrentValue, CleanInputButton } =
    useControlledInput(searchTerm);
  const [isFocused, setIsFocused] = useState(false);
  const toggleFocus = useCallback(
    () => setIsFocused((prevState) => !prevState),
    [],
  );

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(currentValue);
      removeStickyScroll();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (!/(^[-\w \.]+$|^$)/.test(input)) {
      return;
    }

    setCurrentValue(e.target.value);
  };

  const handleClick = () => {
    setSearchTerm(currentValue);
    removeStickyScroll();
  };

  const clean = () => setSearchTerm("");

  return (
    <InputContainer $focused={isFocused}>
      <StyledInput
        onFocus={toggleFocus}
        onBlur={toggleFocus}
        value={currentValue}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
      />
      <CleanButtonContainer onClick={CleanInputButton ? clean : undefined}>
        {CleanInputButton}
      </CleanButtonContainer>
      <Button onClick={handleClick}>
        <img src="/images/enter.svg" alt="Enter icon" />
      </Button>
    </InputContainer>
  );
});
