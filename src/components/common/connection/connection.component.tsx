import { useState, useEffect, useCallback, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useEthers } from "@usedapp/core";
import Link from "next/link";
import { useLockWallets } from "./connection.service";
import {
  Container,
  Button,
  Icon,
  Connected,
  Userpick,
  Triangle,
  Menu,
  MenuHeader,
  MenuBody,
  MenuFooter,
  MenuUserpick,
  Heading,
  Disconnect,
  SpinnerContainer,
} from "./connection.styled";
import { LockWallets } from "./components/lock-wallets/lock-wallets.component";
import { AccountButtons } from "../account-buttons/account-buttons.component";
import { Glow } from "../glow/glow.component";
import { RobohashImage } from "../robohash-image/robohash-image.component";
import { Spinner } from "../spinner/spinner.component";
import { connectionViewModel } from "../../../model/connection.model";
import { preventDefault } from "../../../utils/events.utils";
import { clampMiddle } from "../../../utils/text.utils";

type Props = {
  showGlow?: boolean;
};

export const Connection: React.FC<Props> = observer(({ showGlow = true }) => {
  const { currentAddress, setCurrentAddress } = connectionViewModel;

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = useCallback(
    () => setShowMenu((prevState) => !prevState),
    [],
  );

  const { activateBrowserWallet, deactivate, account, active } = useEthers();

  const id = account?.toLowerCase();

  const { data, isFetching } = useLockWallets(id);

  const connect = useCallback(
    () => activateBrowserWallet(),
    [activateBrowserWallet],
  );

  const disconnect = useCallback(() => {
    setCurrentAddress(null);
    deactivate();
  }, [deactivate, setCurrentAddress]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        showMenu &&
        e.target instanceof Node &&
        !ref.current?.contains(e.target)
      ) {
        toggleMenu();
      }
    };

    window.addEventListener("click", handleOutsideClick);

    return () => window.removeEventListener("click", handleOutsideClick);
  }, [showMenu, toggleMenu]);

  return (
    <Container ref={ref}>
      {Boolean(showGlow) && <Glow src="/images/glow-connection.png" />}
      {typeof id === "string" && active ? (
        <Connected onMouseDown={preventDefault} onClick={toggleMenu}>
          <Userpick>
            <RobohashImage size={36} accountId={currentAddress ?? id} />
          </Userpick>
          {clampMiddle(currentAddress ?? id)}
        </Connected>
      ) : (
        <Button onClick={connect} onMouseDown={preventDefault}>
          <Icon>
            <img src="/images/logo-metamask.svg" alt="Metamask logo" />
          </Icon>
          Connect
        </Button>
      )}
      {typeof id === "string" && showMenu && (
        <>
          <Triangle />
          <Menu>
            <MenuHeader>
              <MenuUserpick>
                <Link
                  href={{
                    pathname: "/profile",
                    query: { id: currentAddress ?? id },
                  }}
                >
                  <RobohashImage size={42} accountId={currentAddress ?? id} />
                </Link>
              </MenuUserpick>
              <section>
                <Heading>
                  <Link
                    href={{
                      pathname: "/profile",
                      query: { id: currentAddress ?? id },
                    }}
                    legacyBehavior
                  >
                    <a onMouseDown={preventDefault}>
                      {clampMiddle(currentAddress ?? id)}
                    </a>
                  </Link>
                </Heading>
                <AccountButtons id={currentAddress ?? id} />
              </section>
            </MenuHeader>
            {isFetching ? (
              <MenuBody>
                <SpinnerContainer>
                  <Spinner />
                </SpinnerContainer>
              </MenuBody>
            ) : data && data.length > 0 ? (
              <MenuBody>
                <LockWallets
                  accountId={id}
                  currentAddress={currentAddress}
                  lockWallets={data}
                  setCurrentAddress={setCurrentAddress}
                />
              </MenuBody>
            ) : null}
            <MenuFooter>
              <Disconnect onMouseDown={preventDefault} onClick={disconnect}>
                Disconnect
              </Disconnect>
            </MenuFooter>
          </Menu>
        </>
      )}
    </Container>
  );
});
