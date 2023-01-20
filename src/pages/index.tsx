import type { NextPage } from 'next';
import { Home } from '../components/home/home.component';
import { getEnvVariables } from '../utils/env.utils';

const HomePage: NextPage = () => {
  return <Home isLite={getEnvVariables().isLite} />;
};

export default HomePage;
