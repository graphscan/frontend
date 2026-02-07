import { ChangeEvent, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { Container, Description } from "./radio-group.styled";
import { Radio } from "../radio/radio.component";
import { usePaginationContext } from "../../table-footer.component";

export const RadioGroup: React.FC = observer(() => {
  const { perPageOptions, setPerPage } = usePaginationContext();

  const handlePerPageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setPerPage(parseInt(e.target.value)),
    [setPerPage],
  );

  return (
    <Container>
      <Description>Items per page:</Description>
      {perPageOptions.map(({ value, checked }) => (
        <Radio
          key={value}
          value={value}
          checked={checked}
          onPerPageChange={handlePerPageChange}
        />
      ))}
    </Container>
  );
});
