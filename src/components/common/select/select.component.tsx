import { Props } from "react-select";
import { StyledSelect } from "./select.styled";

export function Select<Option, IsMulti extends boolean = false>(
  props: Props<Option, IsMulti>,
) {
  return (
    <StyledSelect<Option, IsMulti>
      {...props}
      classNamePrefix="react-select"
      isSearchable={false}
    />
  );
}
