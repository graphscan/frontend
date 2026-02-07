import { useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Control } from "./components/control/control.component";
import { AccountButton } from "./components/account-button/account-button.component";
import {
  Container,
  Left,
  Right,
  Image,
  Name,
  Title,
  Heading,
  Description,
  Text,
  AccountLink,
  Footer,
  ButtonWrapper,
  Created,
  ButtonContainer,
  SelectContainer,
  NewLabel,
} from "../../../../../common/cards/left-card/left-card.styled";
import { Select } from "../../../../../common/select/select.component";
import { SubgraphWarning } from "../../../../../common/subgraph-warning/subgraph-warning.component";
import { TransactionButton } from "../../../../../common/transaction-button/transaction-button.component";
import { SubgraphStates } from "../../../../../../model/subgraph-states.model";
import { handleTooltipLinkClick } from "../../../../../../utils/tooltip.utils";
import { clampMiddle, isOverflow } from "../../../../../../utils/text.utils";
import { onImageLoadError } from "../../../../../../utils/image.utils";

export type Props = SubgraphStates & {
  id: string;
  displayName: string | null;
  image: string | null;
  ownerId: string;
  createdAt: string | null;
  versionId: string;
  versionsOptions: Array<{
    value: string;
    label: string;
  }>;
};

export const AccountCard: React.FC<Props> = ({
  id,
  displayName,
  image,
  ownerId,
  createdAt,
  hasLinkedSubgraphs,
  deprecated,
  denied,
  isNew,
  versionsOptions,
  versionId,
}) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const name = displayName ? displayName : clampMiddle(id);
  const isWarning = denied || deprecated || hasLinkedSubgraphs;

  const { pathname, asPath, push } = useRouter();

  const handleVersionChange = useCallback(
    (option: { label: string; value: string } | null) => {
      if (option) {
        const tab = asPath.split("#")[1];
        push(`${pathname}?version=${option.value}#${tab}`);
      }
    },
    [asPath, pathname, push],
  );

  return (
    <Container>
      <Left>
        <Image>
          {image ? (
            <img
              src={image}
              alt="Subgraph image"
              width="100"
              height="100"
              onError={onImageLoadError}
            />
          ) : (
            <img
              src="/images/no-data.svg"
              alt="No data image"
              width="100"
              height="100"
            />
          )}
        </Image>
        <Name>subgraph</Name>
      </Left>
      <Right>
        <div>
          <Title>
            <Heading
              warning={isWarning}
              ref={ref}
              data-tip={ref.current && isOverflow(ref.current) ? name : null}
            >
              {name}
            </Heading>
            {isWarning && (
              <SubgraphWarning
                denied={denied}
                deprecated={deprecated}
                hasLinkedSubgraphs={hasLinkedSubgraphs}
                isNew={false}
                exclamationSize={40}
              />
            )}
            <ButtonContainer>
              <AccountButton id={id} />
            </ButtonContainer>
            <SelectContainer>
              <Select<{ value: string; label: string }, false>
                options={versionsOptions}
                value={versionsOptions.find((o) => o.value === versionId)}
                onChange={handleVersionChange}
                components={{ Control }}
              />
              {isNew && (
                <NewLabel>
                  <img src="/images/new.svg" alt="New Subgraph" />
                </NewLabel>
              )}
            </SelectContainer>
          </Title>
          <Description>
            <Text>
              Owner:{" "}
              <Link
                href={`/profile?id=${ownerId}#subgraph-owner-subgraphs`}
                passHref
                legacyBehavior
              >
                <AccountLink
                  onMouseDown={handleTooltipLinkClick}
                  data-class="monospaced-tooltip"
                  data-tip={ownerId}
                >
                  {clampMiddle(ownerId)}
                </AccountLink>
              </Link>
            </Text>
          </Description>
        </div>
        <Footer>
          {!deprecated && (
            <>
              <ButtonWrapper>
                <TransactionButton disabled direction="to">
                  Signal
                </TransactionButton>
              </ButtonWrapper>
              <ButtonWrapper>
                <TransactionButton disabled direction="from">
                  Unsignal
                </TransactionButton>
              </ButtonWrapper>
            </>
          )}
          {createdAt && <Created>{createdAt}</Created>}
        </Footer>
      </Right>
    </Container>
  );
};
