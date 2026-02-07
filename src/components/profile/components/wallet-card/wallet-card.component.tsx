import {
  TitleCell,
  Heading,
  TotalGrt,
  TotalValue,
  Stats,
} from "./wallet-card.styled";
import { WalletCardCell } from "./components/wallet-card-cell/wallet-card-cell.component";
import { Container } from "../../../common/cards/right-card/right-card.styled";
import { formatNumber } from "../../../../utils/number.utils";
import { tooltipNumberContent } from "../../../../utils/tooltip.utils";

type Props = {
  balance: number;
  indexerStaked: number;
  delegation: number;
  delegationDelta: number | null;
  curation: number;
  curationDelta: number | null;
};

export const WalletCard: React.FC<Props> = ({
  balance,
  indexerStaked,
  delegation,
  delegationDelta,
  curation,
  curationDelta,
}) => {
  const total = balance + indexerStaked + delegation + curation;

  return (
    <Container>
      <Stats>
        <TitleCell>
          <Heading>Total balance:</Heading>
        </TitleCell>
        <TitleCell>
          <TotalGrt>
            <TotalValue data-tip={tooltipNumberContent(total)}>
              {formatNumber(total)}
            </TotalValue>{" "}
            GRT
          </TotalGrt>
        </TitleCell>
        <WalletCardCell title="In wallet" value={balance} isBalance />
        <WalletCardCell
          title="Curation"
          value={curation}
          delta={curationDelta}
        />
        <WalletCardCell
          title="Delegation"
          value={delegation}
          delta={delegationDelta}
        />
        <WalletCardCell title="Indexer stake" value={indexerStaked} />
      </Stats>
    </Container>
  );
};
