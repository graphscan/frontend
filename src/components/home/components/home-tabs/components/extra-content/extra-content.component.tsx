import { Wrapper, InputWrapper } from "./extra-content.styled";
import { TabsInput } from "./components/tabs-input/tabs-input.component";

export const ExtraContent: React.FC = () => {
  return (
    <Wrapper>
      <InputWrapper>
        <TabsInput />
      </InputWrapper>
    </Wrapper>
  );
};
