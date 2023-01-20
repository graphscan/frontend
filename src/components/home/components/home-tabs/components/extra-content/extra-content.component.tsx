import { useState, useCallback } from 'react';
import { Wrapper, InputWrapper, Button } from './extra-content.styled';
import { Calculator } from './components/calculator/calculator.component';
import { TabsInput } from './components/tabs-input/tabs-input.component';
import { Modal } from '../../../../../common/modal/modal.component';
import { preventDefault } from '../../../../../../utils/events.utils';

type Props = {
  isLite: boolean;
  withCalculator: boolean;
};

export const ExtraContent: React.FC<Props> = ({ isLite, withCalculator }) => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = useCallback(() => {
    setShowModal((prevState) => !prevState);
  }, [setShowModal]);

  return (
    <Wrapper>
      <InputWrapper fullwidth={!withCalculator}>
        <TabsInput />
      </InputWrapper>
      {withCalculator && (
        <>
          <Button onClick={toggleModal} onMouseDown={preventDefault}>
            Rewards Settings
          </Button>
          <Modal title="Rewards Settings" isVisible={showModal} onCancel={toggleModal}>
            <Calculator isLite={isLite} close={toggleModal} />
          </Modal>
        </>
      )}
    </Wrapper>
  );
};
