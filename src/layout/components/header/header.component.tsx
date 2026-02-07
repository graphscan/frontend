import { useCallback } from "react";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import { useNodeDelay } from "./header.service";
import {
  Wrapper,
  Container,
  InputWrapper,
  HelpButton,
  Logo,
  Content,
  RightBlock,
} from "./header.styled";
import { DelayWarning } from "./components/delay-warning/delay-warning.component";
import { AccountSearch } from "./components/account-search/account-search.component";
import { Help } from "./components/help/help.component";
import { Warning } from "./components/warning/warning.component";
import { Connection } from "../../../components/common/connection/connection.component";
import { Glow } from "../../../components/common/glow/glow.component";
import { Modal } from "../../../components/common/modal/modal.component";
import { getEnvVariables } from "../../../utils/env.utils";
import { preventDefault } from "../../../utils/events.utils";
import { helpViewModel } from "../../../view-models/help.view-model";

type Props = {
  isTechicalWorks: boolean;
};

export const Header: React.FC<Props> = observer(({ isTechicalWorks }) => {
  const { data } = useNodeDelay();

  const { isOpen, setIsOpen } = helpViewModel;

  const toggleModal = useCallback(
    () => setIsOpen(!isOpen),
    [isOpen, setIsOpen],
  );

  const warningMessage = getEnvVariables().warningMessage;

  const warningText = warningMessage ? warningMessage.split(" | ") : [];

  return isTechicalWorks ? (
    <Wrapper>
      <Container>
        <Logo>
          <Glow src="/images/glow-header-1.png" />
          <Link href="/">
            <img src="/images/logo.png" alt="Graphscan logo" />
          </Link>
        </Logo>
      </Container>
    </Wrapper>
  ) : (
    <>
      {data && data.isDelayed && (
        <DelayWarning
          delay={data.delay}
          hasBorderBottom={Boolean(warningMessage)}
        />
      )}
      {warningMessage && (
        <Warning
          title={String(warningText[0])}
          description={warningText[1] ?? undefined}
        />
      )}
      <Wrapper>
        <Container>
          <Logo>
            <Glow src="/images/glow-header-1.png" />
            <Link href="/">
              <img src="/images/logo.png" alt="Graphscan logo" />
            </Link>
          </Logo>
          <Content>
            <InputWrapper>
              <Glow src="/images/glow-header-2.png" left="95%" />
              <AccountSearch placeholder="Search" />
            </InputWrapper>
            <RightBlock>
              <HelpButton onClick={toggleModal} onMouseDown={preventDefault}>
                Help
              </HelpButton>
              <Connection />
            </RightBlock>
          </Content>
        </Container>
        <Modal title="Help" isVisible={isOpen} onCancel={toggleModal}>
          <Help />
        </Modal>
      </Wrapper>
    </>
  );
});
