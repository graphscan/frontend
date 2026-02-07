import { Link } from "../../../../../../../common/account-button/account-button.icons";
import { AccountButton as StyledAccountButton } from "../../../../../../../common/account-button/account-button.styled";
import { preventDefault } from "../../../../../../../../utils/events.utils";
import { getEnvVariables } from "../../../../../../../../utils/env.utils";

type Props = {
  id: string;
};

export const AccountButton: React.FC<Props> = ({ id }) => {
  const { thegraphExplorer } = getEnvVariables();

  return (
    <a
      href={`${thegraphExplorer}/explorer/subgraph?id=${id}`.trim()}
      target="_blank"
      rel="noreferrer"
      style={{ outline: "none" }}
      tabIndex={-1}
    >
      <StyledAccountButton onMouseDown={preventDefault}>
        <Link />
      </StyledAccountButton>
    </a>
  );
};
