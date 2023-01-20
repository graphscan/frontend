import { useCallback, useEffect, useState } from 'react';
import { Eth, Goerli } from './website-switch.icons';
import { StyledWebsiteSwitch, WebsiteSwitchMenuItem } from './website-switch.styled';
import { preventDefault } from '../../../../../utils/events.utils';
import { getEnvVariables } from '../../../../../utils/env.utils';

const hostnameToIcon = (hostname?: string) => {
  switch (hostname) {
    case 'mainnet': {
      return <Eth />;
    }
    case 'goerli': {
      return <Goerli />;
    }
    default: {
      return <Eth />;
    }
  }
};

export const WebsiteSwitch: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [host, setHost] = useState('');

  const toggleMenu = useCallback(() => setShowMenu((prevState) => !prevState), []);

  useEffect(() => {
    setHost(`${window.location.protocol}//${window.location.hostname}`);
  }, []);

  useEffect(() => {
    const handleOutsideClick = () => {
      if (showMenu) {
        setShowMenu(false);
      }
    };

    window.addEventListener('click', handleOutsideClick);

    return () => window.removeEventListener('click', handleOutsideClick);
  }, [showMenu]);

  const { chains: chainsString } = getEnvVariables();

  const chains = chainsString.split(',').map((c: string) => c.split('::'));

  const isActive = (hostUrl: string) => host.startsWith(hostUrl);

  return (
    <StyledWebsiteSwitch>
      <button onClick={toggleMenu} className="website-switch-button" onMouseDown={preventDefault}>
        {hostnameToIcon(chains.find(([, hostUrl]: [string, string]) => isActive(hostUrl))?.[0])}
      </button>
      {showMenu && (
        <ul onClick={toggleMenu} className="website-switch-menu">
          {chains.map(([hostName, hostUrl]: [string, string]) => (
            <WebsiteSwitchMenuItem key={hostUrl} isActive={isActive(hostUrl)}>
              <a className="website-switch-link" href={hostUrl} rel="noreferrer">
                <span className="website-switch-menu-item-icon">{hostnameToIcon(hostName)}</span>
                <span className="website-switch-menu-text">{hostName}</span>
              </a>
            </WebsiteSwitchMenuItem>
          ))}
        </ul>
      )}
    </StyledWebsiteSwitch>
  );
};
