import { Warning } from "../warning/warning.component";

type Props = {
  delay: number;
  hasBorderBottom: boolean;
};

export const DelayWarning: React.FC<Props> = ({ delay, hasBorderBottom }) => {
  return (
    <Warning
      title={`Graphscan data is delayed by ${delay} blocks.`}
      description="Subgraph node is out of sync. Please check again soon."
      hasBorderBottom={hasBorderBottom}
    />
  );
};
