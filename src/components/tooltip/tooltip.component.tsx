import ReactTooltip from 'react-tooltip';
import { Styles } from './tooltip.styled';
import { useMounted } from '../../utils/ssr.utils';

type Props = {
  id?: string;
};

export const Tooltip: React.FC<Props> = ({ id }) => {
  const mounted = useMounted();

  return mounted ? (
    <Styles>
      <ReactTooltip
        className="tooltip"
        id={id || ''}
        backgroundColor="#273c5E"
        textColor="#d9e4f4"
        arrowColor="#273c5E"
        effect="solid"
        wrapper="span"
        delayHide={50}
        delayShow={500}
      />
    </Styles>
  ) : null;
};
