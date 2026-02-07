import { HomeTabs } from "./components/home-tabs/home-tabs.component";
import { NetworkStats } from "./components/network-stats/network-stats.component";

export const Home: React.FC = () => {
  return (
    <>
      <NetworkStats />
      <HomeTabs />
    </>
  );
};
