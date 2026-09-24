type AccountsListener = (accounts: unknown) => void;

type WalletProvider = {
  request: (args: { method: string }) => Promise<unknown>;
  on?: (event: string, listener: AccountsListener) => unknown;
  removeListener?: (event: string, listener: AccountsListener) => unknown;
};

export const getWalletProvider = (): WalletProvider | null => {
  try {
    return typeof window === "undefined" ? null : (window.ethereum ?? null);
  } catch {
    return null;
  }
};

const parseAccounts = (value: unknown): string[] | null =>
  Array.isArray(value) &&
  value.every(
    (account) =>
      typeof account === "string" && /^0x[0-9a-f]{40}$/i.test(account),
  )
    ? value
    : null;

export const requestWalletAccounts = async (
  provider: WalletProvider,
  method: "eth_accounts" | "eth_requestAccounts",
): Promise<string[] | null> => {
  try {
    return parseAccounts(await provider.request({ method }));
  } catch {
    // Accessing a method on an injected Proxy can itself throw, before any RPC.
    return null;
  }
};

export const watchWalletAccounts = (
  provider: WalletProvider,
  getCurrentAddress: () => string | null,
  onChange: (address: string | null) => void,
): (() => void) => {
  let stopped = false;
  let pending = false;
  let revision = 0;
  let previousAccounts: string | null = null;
  const handleAccountsChanged: AccountsListener = (value) => {
    if (stopped) return;
    const accounts = parseAccounts(value);
    if (accounts === null) return;
    revision += 1;
    onChange(accounts[0] ?? null);
  };

  let subscribed = false;
  try {
    if (typeof provider.on === "function") {
      provider.on("accountsChanged", handleAccountsChanged);
      subscribed = true;
    }
  } catch {
    // Some injected wallet proxies throw even when reading the `on` property.
  }

  const refreshAccounts = async () => {
    const address = getCurrentAddress();
    if (stopped || pending || !address || document.visibilityState === "hidden")
      return;
    pending = true;
    const startedAtRevision = revision;
    try {
      const accounts = await requestWalletAccounts(provider, "eth_accounts");
      if (
        accounts !== null &&
        !stopped &&
        revision === startedAtRevision &&
        getCurrentAddress() === address
      ) {
        const snapshot = accounts
          .map((account) => account.toLowerCase())
          .join();
        // Establish the wallet's baseline first. The selected profile may be
        // one of its lock wallets, rather than the wallet's first EOA.
        if (
          accounts.length === 0 ||
          (previousAccounts !== null && previousAccounts !== snapshot)
        ) {
          handleAccountsChanged(accounts);
        }
        previousAccounts = snapshot;
      }
    } finally {
      pending = false;
    }
  };

  // Read-only fallback, only querying while connected and the page is visible.
  // Never request connection permissions from a background timer.
  let interval: number | undefined;
  if (!subscribed) {
    window.addEventListener("focus", refreshAccounts);
    interval = window.setInterval(refreshAccounts, 15_000);
  }

  return () => {
    stopped = true;
    if (interval !== undefined) {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshAccounts);
    }
    try {
      provider.removeListener?.("accountsChanged", handleAccountsChanged);
    } catch {
      // A broken provider must not break unmounting or route changes either.
    }
  };
};
