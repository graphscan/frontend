import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const PORTAL_CONTAINER_ID = 'portal-container';

export const Portal: React.FC = ({ children }) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let container = document.getElementById(PORTAL_CONTAINER_ID);
    let c = false;

    if (!container) {
      container = document.createElement('div');
      container.setAttribute('id', PORTAL_CONTAINER_ID);
      document.body.append(container);
      c = true;
    }

    setPortalContainer(container);
    return () => {
      if (c) {
        container?.remove();
      }
    };
  }, []);

  return portalContainer ? createPortal(children, portalContainer) : null;
};
