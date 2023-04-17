import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { CookiesContainer, StyledCookies, CookiesModalContent } from './cookies.styled';
import { CookiesOption } from './components/cookies-option.component';

import { Modal } from '../../../components/common/modal/modal.component';
import { COOKIES_KEYS } from '../../../model/cookies.model';

export const Cookies: React.FC = () => {
  const ref = useRef<HTMLElement>(null);

  const { isConfirmed, kinds } = COOKIES_KEYS;

  const [show, setShow] = useState(
    typeof localStorage.getItem(isConfirmed) === null || localStorage.getItem(isConfirmed) !== 'true'
      ? true
      : false,
  );

  useEffect(() => {
    if (localStorage.getItem(isConfirmed) === 'true' && localStorage.getItem(kinds.thirdParty) === 'true') {
      gtag?.('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
      });
    } else {
      document.cookie.split(';').forEach((x) => {
        const eqPos = x.indexOf('=');
        const name = eqPos > -1 ? x.substring(0, eqPos) : x;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      });
      gtag?.('consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
      });
    }
  }, [isConfirmed, kinds.thirdParty]);

  const [isModal, setIsModal] = useState(false);

  const openModal = useCallback(() => {
    setIsModal(true);
    setShow(false);
  }, []);

  const [isThirdPartyOn, setIsThirdPartyOn] = useState(true);

  const toggleThirdPartyCookies = useCallback(() => setIsThirdPartyOn(!isThirdPartyOn), [
    isThirdPartyOn,
    setIsThirdPartyOn,
  ]);

  const [cookiesHeight, setCookiesHeight] = useState(0);

  useEffect(() => {
    setCookiesHeight(ref.current?.offsetHeight ?? 0);
  }, [setCookiesHeight]);

  const submit = useCallback(() => {
    localStorage.setItem(isConfirmed, 'true');
  }, [isConfirmed]);

  const handleAcceptAll = useCallback(() => {
    submit();
    Object.values(kinds).forEach((value) => localStorage.setItem(value, 'true'));
    gtag?.('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });
    setShow(false);
  }, [kinds, submit]);

  const handleAccept = useCallback(() => {
    submit();
    if (isThirdPartyOn) {
      localStorage.setItem(kinds.thirdParty, 'true');
      gtag?.('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
      });
    }
    setIsModal(false);
    setShow(false);
  }, [isThirdPartyOn, kinds.thirdParty, submit]);

  const handleReject = useCallback(() => {
    submit();
    Object.values(kinds).forEach((value) => localStorage.removeItem(value));
    setIsThirdPartyOn(false);
    setIsModal(false);
    setShow(false);
  }, [kinds, submit]);

  return (
    <>
      {show ? (
        <CookiesContainer cookiesHeight={cookiesHeight}>
          <StyledCookies selfHeight={cookiesHeight} ref={ref}>
            <h3 className="cookies-title">
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <path d="M0 20.4H20V0.4H0V20.4Z" fill="url(#pattern0)" />
                <defs>
                  <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                    <use xlinkHref="#image0_4406_5071" transform="scale(0.015625)" />
                  </pattern>
                  <image
                    id="image0_4406_5071"
                    width="64"
                    height="64"
                    // eslint-disable-next-line max-len
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
              We use cookies
            </h3>
            <p className="cookies-description">
              Cookies on this website may be used by Web3alert.io , and/or its partners, namely to improve the
              browsing experience and performance of this website. The website may also use its own or
              third-party cookies to analyse browsing habits, personalise content and advertisements or make
              certain features available. You can accept all cookies or manage/disable some of the cookies by
              clicking on "Configure Cookies". For more information please visit our{' '}
              <Link href="/policy">
                <a>Cookie Policy</a>
              </Link>
              .
            </p>
            <div className="cookies-buttons">
              <button onClick={handleAcceptAll} className="cookies-button cookies-button_with-background">
                Accept all
              </button>
              <button onClick={openModal} className="cookies-button cookies-button_only-text">
                Configure Cookies
              </button>
              <button onClick={handleReject} className="cookies-button cookies-button_only-text">
                Reject Unnecessary
              </button>
            </div>
          </StyledCookies>
        </CookiesContainer>
      ) : null}
      <Modal isVisible={isModal} withoutCloseButton>
        <CookiesModalContent>
          <h2 className="cookies-modal-content-title">Configure Cookies</h2>
          <p className="cookies-modal-content-description">
            Click on the different categories to manage the cookies used on this website and change their
            settings. Blocking certain types of cookies may have an impact on your browsing experience on the
            website and the services we offer. Strictly necessary cookies will always remain active.
          </p>
          <h2 className="cookies-modal-content-title">Manage Preferences</h2>
          <div className="cookies-modal-content-options-container">
            <section className="cookies-modal-content-options">
              <CookiesOption label="Strictly Necessary">
                Allow the users to browse the website and use the applications as well as letting users access
                secure areas on the website. Without these cookies, the services the users request cannot be
                provided.
              </CookiesOption>
              <CookiesOption
                label="Third party"
                switchable
                isChecked={isThirdPartyOn}
                onChange={toggleThirdPartyCookies}
              >
                Google Analytics, etc. These cookies measure the success of the applications and the
                effectiveness of third-party publicity. They can also be used to customize a widget with the
                user's details.
              </CookiesOption>
            </section>
          </div>
          <section className="cookies-modal-content-buttons">
            <button
              onClick={handleAccept}
              className="cookies-modal-content-button cookies-modal-content-button_with-background"
              disabled={!isModal}
            >
              Accept
            </button>
          </section>
        </CookiesModalContent>
      </Modal>
    </>
  );
};
