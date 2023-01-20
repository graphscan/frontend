import { useState, useEffect, useCallback, useRef } from 'react';
import Truncate from 'react-truncate';
import ResizeObserver from 'rc-resize-observer';
import {
  Header,
  HeaderCell,
  DescriptionHeading,
  DescriptionText,
  Heading,
  Description,
  DescriptionButton,
  ModalDescription,
  TotalValue,
} from './description-card.styled';
import { Container } from '../../../../../common/cards/right-card/right-card.styled';
import { Modal } from '../../../../../common/modal/modal.component';
import { preventDefault } from '../../../../../../utils/events.utils';
import { formatNumber } from '../../../../../../utils/number.utils';
import { tooltipNumberContent } from '../../../../../../utils/tooltip.utils';

export type Props = {
  description: string | null;
  signalledTokens: number;
  allocated: number;
  deprecated: boolean;
};

export const DescriptionCard: React.FC<Props> = ({ description, signalledTokens, allocated, deprecated }) => {
  const [expanded, setExpanded] = useState(true);
  const [ready, setReady] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const ref = useRef<Truncate>(null);

  const toggleModal = useCallback(() => setShowModal((prevState) => !prevState), []);

  useEffect(() => {
    if (!ready) {
      document.fonts.ready.then(() => {
        setReady(true);
        setExpanded(false);
      });
    }
  });

  return (
    <Container>
      {typeof signalledTokens !== 'undefined' && typeof allocated !== 'undefined' && (
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
            <TotalValue data-tip={tooltipNumberContent(allocated)}>{formatNumber(allocated)}</TotalValue>
          </HeaderCell>
        </Header>
      )}
      <Description>
        <DescriptionHeading>Description</DescriptionHeading>
        <ResizeObserver onResize={() => ref.current?.onResize()}>
          <DescriptionText>
            {!deprecated ? (
              <Truncate
                ref={ref}
                lines={!expanded && 2}
                ellipsis={
                  <DescriptionButton onMouseDown={preventDefault} onClick={toggleModal}>
                    &middot;&middot;&middot;
                  </DescriptionButton>
                }
              >
                {description ? description : 'Description was not provided.'}
              </Truncate>
            ) : (
              'Subgraph is deprecated'
            )}
          </DescriptionText>
        </ResizeObserver>
      </Description>
      {description && (
        <Modal title="Description" isVisible={showModal} onCancel={toggleModal}>
          <ModalDescription>{description}</ModalDescription>
        </Modal>
      )}
    </Container>
  );
};
