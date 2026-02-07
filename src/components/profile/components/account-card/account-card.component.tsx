import { Fragment } from "react";
import Link from "next/link";
import { Arbitrum, Eth } from "./account-card.icons";
import { IconBox } from "./account-card.styled";

import {
  Container,
  Left,
  Right,
  Name,
  Title,
  Heading,
  Description,
  Text,
  AccountLink,
  Footer,
  ButtonWrapper,
  Created,
  DescriptionRow,
} from "../../../common/cards/left-card/left-card.styled";
import { AccountButtons } from "../../../common/account-buttons/account-buttons.component";
import { RobohashImage } from "../../../common/robohash-image/robohash-image.component";
import { clampMiddle } from "../../../../utils/text.utils";

type Props = {
  id: string;
  indexerId: string | null;
  name: string;
  createdAt: string | null;
  tokenLockWalletsIds: string | Array<string>;
  isDelegator: boolean;
  isIndexer: boolean;
  isProtocolContract: boolean;
  beneficiaryFromContract?: string;
};

export const AccountCard: React.FC<Props> = ({
  id,
  indexerId,
  name,
  createdAt,
  tokenLockWalletsIds,
  isDelegator,
  isIndexer,
  isProtocolContract,
  beneficiaryFromContract,
}) => {
  // const { active } = useEthers();

  // // const [showDelegationModal, setShowDelegationModal] = useState(false);
  // // const [transaction, setTransaction] =
  // //   useState<DelegationTransactionWithUI | null>(null);

  // const router = useRouter();

  // useEffect(() => {
  //   const handleRouteChange = () => {
  //     setShowDelegationModal(false);
  //     setTransaction(null);
  //   };

  //   router.events.on("routeChangeStart", handleRouteChange);
  // }, [router.events]);

  // const toggleDelegationModal = useCallback(() => {
  //   setShowDelegationModal((prevState) => {
  //     if (prevState) {
  //       setTransaction(null);
  //     }

  //     return !prevState;
  //   });
  // }, []);

  // const handleTransactionButtonClick =
  //   (transaction: DelegationTransactionWithUI) => () => {
  //     toggleDelegationModal();
  //     setTransaction(transaction);
  //   };

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
          {createdAt && <Created>{createdAt}</Created>}
        </Title>
        {typeof beneficiaryFromContract === "string" ? (
          <Description>
            <DescriptionRow>
              <IconBox>
                <Arbitrum />
              </IconBox>
              <Text>
                This Account is GRT Locked smartcontract. Beneficiary is{" "}
                <AccountLink
                  href={`https://arbiscan.io/address/${beneficiaryFromContract}`}
                  target="_blank"
                  rel="norefferer"
                  data-tip={beneficiaryFromContract}
                  data-class="monospaced-tooltip"
                >
                  {clampMiddle(beneficiaryFromContract)}
                </AccountLink>
              </Text>
            </DescriptionRow>
          </Description>
        ) : (
          (typeof tokenLockWalletsIds === "string" ||
            tokenLockWalletsIds.length > 0 ||
            isProtocolContract) && (
            <Description>
              <DescriptionRow>
                {!isProtocolContract && (
                  <IconBox>
                    <Eth />
                  </IconBox>
                )}
                <Text>
                  {typeof tokenLockWalletsIds === "string" ? (
                    <>
                      This Account is GRT Locked smartcontract. Beneficiary is{" "}
                      <Link
                        href={{
                          pathname: "/profile",
                          query: { id: tokenLockWalletsIds },
                        }}
                        passHref
                        legacyBehavior
                      >
                        <AccountLink
                          data-tip={tokenLockWalletsIds}
                          data-class="monospaced-tooltip"
                        >
                          {clampMiddle(tokenLockWalletsIds)}
                        </AccountLink>
                      </Link>
                    </>
                  ) : isProtocolContract ? (
                    "This is The Graph Protocol smartcontract."
                  ) : (
                    <>
                      This Account is beneficiary for:{" "}
                      {tokenLockWalletsIds.map((a, i, arr) => (
                        <Fragment key={a}>
                          <Link
                            href={{ pathname: "/profile", query: { id: a } }}
                            passHref
                            legacyBehavior
                          >
                            <AccountLink data-tip={a}>
                              {clampMiddle(a)}
                            </AccountLink>
                          </Link>
                          {i < arr.length - 1 && ", "}
                        </Fragment>
                      ))}
                    </>
                  )}
                </Text>
              </DescriptionRow>
            </Description>
          )
        )}
        <Footer>
          {/* {(isIndexer || isDelegator) && (
            <>
              {isIndexer && (
                <>
                  <ButtonWrapper>
                    <TransactionButton
                      direction="to"
                      // onClick={handleTransactionButtonClick("delegate")}
                    >
                      Delegate
                    </TransactionButton>
                  </ButtonWrapper>
                  <ButtonWrapper>
                    <TransactionButton
                      direction="from"
                      disabled={!active}
                      onClick={handleTransactionButtonClick("undelegate")}
                    >
                      Undelegate
                    </TransactionButton>
                  </ButtonWrapper>
                </>
              )}
            </>
          )} */}
        </Footer>
      </Right>
      {/* <Modal
        title={
          typeof transaction === "string" ? capitalize(transaction) : undefined
        }
        isVisible={showDelegationModal}
        onCancel={toggleDelegationModal}
      >
        {typeof transaction === "string" && indexerId !== null && (
          <Web3Delegation indexerId={indexerId} transaction={transaction} />
        )}
      </Modal> */}
    </Container>
  );
};
