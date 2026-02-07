import ReactTooltip from "react-tooltip";
import { StyledTooltip } from "./tooltip.styled";
import { useMounted } from "../../utils/ssr.utils";

type Props = {
  id?: string;
  children?: React.ReactNode;
};

export const Tooltip: React.FC<Props> = ({ id, children }) => {
  const mounted = useMounted();

  return mounted ? (
    <StyledTooltip>
      <ReactTooltip
        className="tooltip"
        id={id || ""}
        backgroundColor="#273c5E"
        textColor="#d9e4f4"
        arrowColor="#273c5E"
        effect="solid"
        wrapper="span"
        delayHide={50}
        delayShow={500}
      >
        {children}
      </ReactTooltip>
    </StyledTooltip>
  ) : null;
};
