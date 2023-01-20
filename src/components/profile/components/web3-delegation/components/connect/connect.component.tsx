import { ethers } from 'ethers';
import { Inactive, LoginIcon, InactiveDescription } from './connect.styled';
import { Connection } from '../../../../../common/connection/connection.component';
import { getEnvVariables } from '../../../../../../utils/env.utils';
import { capitalize } from '../../../../../../utils/text.utils';

export const Connect: React.FC = () => {
  const supportedNetwork = ethers.providers.getNetwork(getEnvVariables().chainId).name;

  return (
    <Inactive>
      <LoginIcon>
        <img src="/images/login.svg" alt="Pointer" />
      </LoginIcon>
      <InactiveDescription>
        You need to be connected to{' '}
        {capitalize(supportedNetwork === 'homestead' ? 'mainnet' : supportedNetwork)} before interacting with
        the protocol
      </InactiveDescription>
      <Connection showGlow={false} />
    </Inactive>
  );
};
