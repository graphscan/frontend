import { useState, useCallback } from "react";
import {
  Header,
  HeaderCell,
  DescriptionHeading,
  DescriptionText,
  Heading,
  Description,
  ModalDescription,
  TotalValue,
} from "./description-card.styled";
import { Container } from "../../../../../common/cards/right-card/right-card.styled";
import { Modal } from "../../../../../common/modal/modal.component";
import { formatNumber } from "../../../../../../utils/number.utils";
import { tooltipNumberContent } from "../../../../../../utils/tooltip.utils";

export type Props = {
  description: string | null;
  signalledTokens: number;
  allocated: number;
  deprecated: boolean;
};

export const DescriptionCard: React.FC<Props> = ({
  description,
  signalledTokens,
  allocated,
  deprecated,
}) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = useCallback(
    () => setShowModal((prevState) => !prevState),
    [],
  );

  const descriptionText = deprecated
    ? "Subgraph is deprecated"
    : description || "Description was not provided.";

  return (
    <Container>
      {typeof signalledTokens !== "undefined" &&
        typeof allocated !== "undefined" && (
          <Header>
            <HeaderCell>
              <Heading>
                Current
                <br />
                Signaled:
              </Heading>
              <TotalValue data-tip={tooltipNumberContent(signalledTokens)}>
                {formatNumber(signalledTokens)}
              </TotalValue>
            </HeaderCell>
            <HeaderCell>
              <Heading>Allocated:</Heading>
              <TotalValue data-tip={tooltipNumberContent(allocated)}>
                {formatNumber(allocated)}
              </TotalValue>
            </HeaderCell>
          </Header>
        )}
      <Description>
        <DescriptionHeading>Description</DescriptionHeading>
        <DescriptionText
          truncate={!deprecated && !!description}
          onClick={description ? toggleModal : undefined}
        >
          {descriptionText}
        </DescriptionText>
      </Description>
      {description && (
        <Modal title="Description" isVisible={showModal} onCancel={toggleModal}>
          <ModalDescription>{description}</ModalDescription>
        </Modal>
      )}
    </Container>
  );
};
