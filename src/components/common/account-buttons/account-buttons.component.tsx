import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Copy } from './account-buttons.icons';
import { StyledAccountButtons } from './account-buttons.styled';
import { Link } from '../account-button/account-button.icons';
import { AccountButton } from '../account-button/account-button.styled';
import { getEnvVariables } from '../../../utils/env.utils';
import { preventDefault } from '../../../utils/events.utils';
import { useTooltip } from '../../../utils/tooltip.utils';

type Props = {
  id: string;
};

export const AccountButtons: React.FC<Props> = ({ id }) => {
  useTooltip();

  return (
    <StyledAccountButtons>
      <CopyToClipboard text={id}>
        <AccountButton data-tip="Copy to clipboard" onMouseDown={preventDefault}>
          <Copy />
        </AccountButton>
      </CopyToClipboard>
      <a
        href={`${getEnvVariables().ethereumExplorer}/address/${id}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ outline: 'none' }}
        tabIndex={-1}
      >
        <AccountButton onMouseDown={preventDefault}>
          <Link />
        </AccountButton>
      </a>
    </StyledAccountButtons>
  );
};
