import { Copy } from "./account-buttons.icons";
import { StyledAccountButtons } from "./account-buttons.styled";
import { Link } from "../account-button/account-button.icons";
import { AccountButton } from "../account-button/account-button.styled";
import { getEnvVariables } from "../../../utils/env.utils";
import { preventDefault } from "../../../utils/events.utils";
import { useTooltip } from "../../../utils/tooltip.utils";

type Props = {
  id: string;
};

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

export const AccountButtons: React.FC<Props> = ({ id }) => {
  useTooltip();

  return (
    <StyledAccountButtons>
      <AccountButton
        data-tip="Copy to clipboard"
        onClick={() => copyToClipboard(id)}
      >
        <Copy />
      </AccountButton>
      <a
        href={`${getEnvVariables().ethereumExplorer}/address/${id}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ outline: "none" }}
        tabIndex={-1}
      >
        <AccountButton onMouseDown={preventDefault}>
          <Link />
        </AccountButton>
      </a>
    </StyledAccountButtons>
  );
};
