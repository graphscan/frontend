"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { clampMiddle } from "../../../utils/text.utils";

type Props = {
  showGlow?: boolean;
};

const CONNECTED_ACCOUNT_KEY = "connected-account-v1";

function saveAccount(addr: string | null) {
  if (addr) {
    localStorage.setItem(CONNECTED_ACCOUNT_KEY, addr);
  } else {
    localStorage.removeItem(CONNECTED_ACCOUNT_KEY);
  }
}

function getSavedAccount() {
  return localStorage.getItem(CONNECTED_ACCOUNT_KEY);
}
// TODO: if we want real interactions with wallet we need to rewrite everything to support modern providers and probably switch to viem.
// and refactor evertything to more complex
export function Connection({ showGlow = true }: Props) {
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = useCallback(
    () => setShowMenu((prevState) => !prevState),
    []
  );

  const active = currentAddress !== null;
  const id = currentAddress?.toLowerCase();

  const { data, isFetching } = useLockWallets(id);

  // Restore connection on mount only if we have a saved account
  useEffect(() => {
    if (!window.ethereum) return;

    const saved = getSavedAccount();
    if (saved) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (
            accounts.some((a: string) => a.toLowerCase() === saved.toLowerCase())
          ) {
            setCurrentAddress(saved);
          } else {
            setCurrentAddress(null);
          }
        });
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setCurrentAddress(accounts[0]);
      } else {
        setCurrentAddress(null);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) return;

    const accounts: string[] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    if (accounts.length > 0) {
      setCurrentAddress(accounts[0]);
    }
  }, []);

  useEffect(() => {
    saveAccount(currentAddress);
  }, [currentAddress]);

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
        <Connected onClick={toggleMenu}>
          <Userpick>
            <RobohashImage size={36} accountId={currentAddress ?? id} />
          </Userpick>
          {clampMiddle(currentAddress ?? id)}
        </Connected>
      ) : (
        <Button onClick={connect}>
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
                  >
                    {clampMiddle(currentAddress ?? id)}
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
              <Disconnect onClick={() => setCurrentAddress(null)}>
                Disconnect
              </Disconnect>
            </MenuFooter>
          </Menu>
        </>
      )}
    </Container>
  );
}
