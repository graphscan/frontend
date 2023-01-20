import { useAccountType } from './profile.service';
import { ProfileCards } from './components/profile-cards/profile-cards.component';
import { ProfileTabs } from './components/profile-tabs/profile-tabs.component';
import { AccountPreloader } from '../common/account-preloader/account-preloader.component';
import { Empty } from '../common/empty/empty.component';
import { useGraphNetwork } from '../../services/graph-network.service';
import { ProfileCardsLite } from './components/profile-cards-lite/profile-cards-lite.component';

type Props = {
  id: string;
  isLite: boolean;
};

export const Profile: React.FC<Props> = ({ id, isLite }) => {
  const {
    data: graphNetwork,
    error: graphNetworkError,
    isLoading: isGraphNetworkLoading,
  } = useGraphNetwork();

  const { data: accountTypeData, error: accountTypeError, isLoading: isAccountTypeLoading } = useAccountType(
    id,
  );

  const isProtocolContract = graphNetwork && Object.values(graphNetwork).some((value) => value === id);

  if (isGraphNetworkLoading || isAccountTypeLoading) {
    return <AccountPreloader />;
  }

  const error = graphNetworkError || accountTypeError;

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return <Empty />;
  }

  if (!accountTypeData) {
    return <Empty />;
  }

  return (
    <>
      {isLite ? (
        <ProfileCardsLite id={id} isProtocolContract={Boolean(isProtocolContract)} />
      ) : (
        <ProfileCards id={id} isProtocolContract={Boolean(isProtocolContract)} />
      )}
      {!isProtocolContract && <ProfileTabs id={id} isLite={isLite} {...accountTypeData} />}
    </>
  );
};
