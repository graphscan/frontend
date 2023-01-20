import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useNodeDelay } from './header.service';
import { Wrapper, Container, InputWrapper, HelpButton, Logo, Content, RightBlock } from './header.styled';
import { DelayWarning } from './components/delay-warning/delay-warning.component';
import { AccountSearch } from './components/account-search/account-search.component';
import { Help } from './components/help/help.component';
import { Warning } from './components/warning/warning.component';
import { WebsiteSwitch } from './components/website-switch/website-switch.component';
import { Connection } from '../../../components/common/connection/connection.component';
import { Glow } from '../../../components/common/glow/glow.component';
import { Modal } from '../../../components/common/modal/modal.component';
import { getEnvVariables } from '../../../utils/env.utils';
import { preventDefault } from '../../../utils/events.utils';

type Props = {
  isTechicalWorks: boolean;
};

export const Header: React.FC<Props> = ({ isTechicalWorks }) => {
  const { data } = useNodeDelay();

  const [showModal, setShowModal] = useState(false);

  const toggleModal = useCallback(() => setShowModal((prevState) => !prevState), []);

  const warningMessage = getEnvVariables().warningMessage;

  const warningText = warningMessage ? warningMessage.split(' | ') : [];

  return isTechicalWorks ? (
    <Wrapper>
      <Container>
        <Logo>
          <Glow src="/images/glow-header-1.png" />
          <Link href="/">
            <a>
              <img src="/images/logo.png" alt="Graphscan logo" />
            </a>
          </Link>
        </Logo>
      </Container>
    </Wrapper>
  ) : (
    <>
      {data && data.isDelayed && (
        <DelayWarning delay={data.delay} hasBorderBottom={Boolean(warningMessage)} />
      )}
      {warningMessage && <Warning title={String(warningText[0])} description={warningText[1] ?? undefined} />}
      <Wrapper>
        <Container>
          <Logo>
            <Glow src="/images/glow-header-1.png" />
            <Link href="/">
              <a>
                <img src="/images/logo.png" alt="Graphscan logo" />
              </a>
            </Link>
          </Logo>
          <WebsiteSwitch />
          <Content>
            <InputWrapper>
              <Glow src="/images/glow-header-2.png" left="95%" />
              <AccountSearch isLite={getEnvVariables().isLite} placeholder="Search" />
            </InputWrapper>
            <RightBlock>
              <HelpButton onClick={toggleModal} onMouseDown={preventDefault}>
                Help
              </HelpButton>
              <Connection />
            </RightBlock>
          </Content>
        </Container>
        <Modal title="Help" isVisible={showModal} onCancel={toggleModal}>
          <Help />
        </Modal>
      </Wrapper>
    </>
  );
};
