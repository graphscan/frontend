import { useAccountType } from "./profile.service";
import { ProfileCards } from "./components/profile-cards/profile-cards.component";
import { ProfileTabs } from "./components/profile-tabs/profile-tabs.component";
import { AccountPreloader } from "../common/account-preloader/account-preloader.component";
import { Empty } from "../common/empty/empty.component";
import { useGraphNetwork } from "../../services/graph-network.service";

type Props = {
  id: string;
};

export const Profile: React.FC<Props> = ({ id }) => {
  const {
    data: graphNetwork,
    error: graphNetworkError,
    isLoading: isGraphNetworkLoading,
  } = useGraphNetwork();

  const {
    data: accountTypeData,
    error: accountTypeError,
    isLoading: isAccountTypeLoading,
  } = useAccountType(id);

  const isProtocolContract =
    graphNetwork && Object.values(graphNetwork).some((value) => value === id);

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
      {
        <ProfileCards
          id={id}
          isProtocolContract={Boolean(isProtocolContract)}
        />
      }
      {!isProtocolContract && <ProfileTabs id={id} {...accountTypeData} />}
    </>
  );
};
