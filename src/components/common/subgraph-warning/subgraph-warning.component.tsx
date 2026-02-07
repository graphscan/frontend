import { Exclamation } from "../exclamation/exclamation.component";
import { Container, NewIcon, ExlamationIcon } from "./subgraph-warning.styled";

type Props = {
  deprecated: boolean;
  denied: boolean;
  hasLinkedSubgraphs: boolean;
  isNew: boolean;
  exclamationSize?: number;
};

export const SubgraphWarning: React.FC<Props> = ({
  deprecated,
  denied,
  hasLinkedSubgraphs,
  isNew,
  exclamationSize = 36,
}) => {
  const isInvalid = deprecated || denied;
  const hasExlamation = isInvalid || hasLinkedSubgraphs;
  const color = isInvalid ? "#ff2055" : "#f86342";

  return (
    <Container>
      {isNew && (
        <NewIcon>
          <img src="/images/new.svg" alt="New Subgraph" />
        </NewIcon>
      )}
      {hasExlamation && (
        <ExlamationIcon $exclamationSize={exclamationSize} $isNew={isNew}>
          <Exclamation
            color={color}
            isHtml={isInvalid}
            tooltipText={
              !isInvalid && hasLinkedSubgraphs
                ? "There are other valid subgraphs with the same deployment id."
                : `
            ${deprecated ? "<p>Subgraph is deprecated.</p>" : ""}
            ${denied ? "<p>Subgraph is denied to receive rewards.</p>" : ""}
          `
            }
          />
        </ExlamationIcon>
      )}
    </Container>
  );
};
