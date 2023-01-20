import { HomeTabs } from './components/home-tabs/home-tabs.component';
import { NetworkStats } from './components/network-stats/network-stats.component';

type Props = {
  isLite: boolean;
};

export const Home: React.FC<Props> = ({ isLite }) => {
  return (
    <>
      <NetworkStats />
      <HomeTabs isLite={isLite} />
    </>
  );
};
