import { useState, useCallback } from 'react';
import { useEthers } from '@usedapp/core';
import Link from 'next/link';
import { Web3Delegation } from '../web3-delegation/web3-delegation.component';
import {
  Container,
  Left,
  Right,
  Name,
  Title,
  Heading,
  Description,
  Text,
  Accounts,
  AccountLink,
  Footer,
  ButtonWrapper,
  Created,
} from '../../../common/cards/left-card/left-card.styled';
import { AccountButtons } from '../../../common/account-buttons/account-buttons.component';
import { Modal } from '../../../common/modal/modal.component';
import { DelegationTransactionWithUI } from '../../../../model/web3-transations.model';
import { TransactionButton } from '../../../common/transaction-button/transaction-button.component';
import { RobohashImage } from '../../../common/robohash-image/robohash-image.component';
import { clampMiddle, capitalize } from '../../../../utils/text.utils';

type Props = {
  id: string;
  indexerId: string | null;
  name: string;
  createdAt: string | null;
  tokenLockWalletsIds: string | Array<string>;
  isProtocolContract: boolean;
};

export const AccountCard: React.FC<Props> = ({
  id,
  indexerId,
  name,
  createdAt,
  tokenLockWalletsIds,
  isProtocolContract,
}) => {
  const { active } = useEthers();

  const [showModal, setShowModal] = useState(false);
  const [transaction, setTransaction] = useState<DelegationTransactionWithUI | null>(null);

  const toggleModal = useCallback(() => {
    setShowModal((prevState) => {
      if (prevState) {
        setTransaction(null);
      }

      return !prevState;
    });
  }, [setShowModal]);

  const handleTransactionButtonClick = (transaction: DelegationTransactionWithUI) => () => {
    toggleModal();
    setTransaction(transaction);
  };

  return (
    <Container>
      <Left>
        <RobohashImage size={name.length > 0 ? 100 : 120} accountId={id} />
        <Name data-tip={name}>{name}</Name>
      </Left>
      <Right>
        <Title>
          <Heading>{clampMiddle(id)}</Heading>
          <AccountButtons id={id} />
        </Title>
        {(typeof tokenLockWalletsIds === 'string' ||
          tokenLockWalletsIds.length > 0 ||
          isProtocolContract) && (
          <Description oneLine={isProtocolContract}>
            <img src="/images/connection-line.svg" alt="Connection line" />
            <Text>
              {typeof tokenLockWalletsIds === 'string'
                ? 'This Account is GRT Locked smartcontract. Beneficiary is'
                : isProtocolContract
                ? 'This is The Graph Protocol smartcontract.'
                : 'This Account is beneficiary of GRT Locked smartcontracts:'}
            </Text>
            <Accounts>
              {typeof tokenLockWalletsIds === 'string' ? (
                <Link href={{ pathname: '/profile', query: { id: tokenLockWalletsIds } }} passHref>
                  <AccountLink data-tip={tokenLockWalletsIds} data-class="monospaced-tooltip">
                    {clampMiddle(tokenLockWalletsIds)}
                  </AccountLink>
                </Link>
              ) : (
                tokenLockWalletsIds.map((a) => (
                  <Link key={a} href={{ pathname: '/profile', query: { id: a } }} passHref>
                    <AccountLink data-tip={a}>{clampMiddle(a)}</AccountLink>
                  </Link>
                ))
              )}
            </Accounts>
          </Description>
        )}
        <Footer>
          {indexerId && (
            <>
              <ButtonWrapper>
                <TransactionButton direction="to" onClick={handleTransactionButtonClick('delegate')}>
                  Delegate
                </TransactionButton>
              </ButtonWrapper>
              <ButtonWrapper>
                <TransactionButton
                  direction="from"
                  disabled={!active}
                  onClick={handleTransactionButtonClick('undelegate')}
                >
                  Undelegate
                </TransactionButton>
              </ButtonWrapper>
            </>
          )}
          {createdAt && <Created>{createdAt}</Created>}
        </Footer>
      </Right>
      <Modal
        title={typeof transaction === 'string' ? capitalize(transaction) : undefined}
        isVisible={showModal}
        onCancel={toggleModal}
      >
        {typeof transaction === 'string' && indexerId !== null && (
          <Web3Delegation indexerId={indexerId} transaction={transaction} />
        )}
      </Modal>
    </Container>
  );
};
