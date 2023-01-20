import { useAccount } from './profile-cards-lite.service';
import { AccountCard } from '../account-card/account-card.component';
import { WalletCard } from '../wallet-card/wallet-card.component';
import { Card, Cards } from '../../../common/cards/cards.styled';
import { CardsPreloader } from '../../../common/cards/cards-preloader/cards-preloader.component';
import { Empty } from '../../../common/empty/empty.component';
import { useTooltip } from '../../../../utils/tooltip.utils';

type Props = {
  id: string;
  isProtocolContract: boolean;
};

export const ProfileCardsLite: React.FC<Props> = ({ id, isProtocolContract }) => {
  useTooltip();

  const { data, error, isLoading } = useAccount(id);

  if (isLoading) {
    return <CardsPreloader />;
  }

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return (
      <Cards>
        <Card>
          <Empty />
        </Card>
        <Card>
          <Empty />
        </Card>
      </Cards>
    );
  }

  if (!data) {
    return null;
  }

  const { account, wallet, showWallet } = data;

  return (
    <Cards>
      <Card>
        <AccountCard id={id} isProtocolContract={isProtocolContract} {...account} />
      </Card>
      <Card>{isProtocolContract || !showWallet ? <Empty /> : <WalletCard {...wallet} />}</Card>
    </Cards>
  );
};
