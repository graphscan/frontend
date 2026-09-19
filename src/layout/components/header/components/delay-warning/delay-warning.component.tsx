import { Warning } from "../warning/warning.component";
import { formatNodeDelay } from "../../../../../utils/node-delay.utils";

type Props = {
  delaySeconds: number;
  hasBorderBottom: boolean;
};

export const DelayWarning: React.FC<Props> = ({
  delaySeconds,
  hasBorderBottom,
}) => {
  return (
    <Warning
      title={`Graphscan data is delayed by ${formatNodeDelay(delaySeconds)}.`}
      description="Recent activity may not appear yet. This notice updates automatically."
      hasBorderBottom={hasBorderBottom}
    />
  );
};
