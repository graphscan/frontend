import {
  AccountCard,
  Props as AccountCardData,
} from "./components/account-card/account-card.component";
import {
  DescriptionCard,
  Props as DescriptionCardData,
} from "./components/description-card/description-card.component";
import { Card, Cards } from "../../../common/cards/cards.styled";
import { useTooltip } from "../../../../utils/tooltip.utils";

type Props = {
  accountCardData: AccountCardData;
  descriptionCardData: DescriptionCardData;
};

export const SubgraphCards: React.FC<Props> = ({
  accountCardData,
  descriptionCardData,
}) => {
  useTooltip();

  return (
    <Cards>
      <Card>
        <AccountCard {...accountCardData} />
      </Card>
      <Card>
        <DescriptionCard {...descriptionCardData} />
      </Card>
    </Cards>
  );
};
