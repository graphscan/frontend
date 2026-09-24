const assert = require("node:assert/strict");
const { test } = require("node:test");
const { createLoader } = require("./helpers/load-typescript.cjs");

const A = `0x${"a".repeat(40)}`;
const B = `0x${"b".repeat(40)}`;
const LOCK = `0x${"c".repeat(40)}`;
const utilsPath = "src/utils/wallet-provider.utils.ts";
function brokenProxy(request = async () => [A]) {
  const target = { request };
  Object.defineProperty(target, "on", {
    value: function on() {},
    writable: false,
    configurable: false,
  });
  return new Proxy(target, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      return key === "on" ? value.bind(target) : value;
    },
  });
}
function browser(provider) {
  const listeners = new Map();
  const intervals = new Map();
  const globals = {
    document: { visibilityState: "visible" },
    window: {
      ethereum: provider,
      addEventListener: (event, fn) => listeners.set(event, fn),
      removeEventListener: (event, fn) => {
        if (listeners.get(event) === fn) listeners.delete(event);
      },
      setInterval: (fn, ms) => {
        intervals.set(1, { fn, ms });
        return 1;
      },
      clearInterval: (id) => intervals.delete(id),
    },
  };
  return {
    globals,
    listeners,
    intervals,
    api: createLoader({}, globals)(utilsPath),
  };
}

test("the reported immutable on Proxy error is reproduced and cannot crash watching or cleanup", () => {
  const provider = brokenProxy();
  assert.throws(() => provider.on, /read-only and non-configurable/);
  const { api, intervals, listeners } = browser(provider);
  const stop = api.watchWalletAccounts(
    provider,
    () => null,
    () => {},
  );
  assert.equal(intervals.get(1).ms, 15_000);
  assert.ok(listeners.has("focus"));
  assert.doesNotThrow(stop);
  assert.equal(intervals.size, 0);
  assert.equal(listeners.size, 0);
});

test("provider discovery tolerates SSR, missing wallets and throwing ethereum getters", () => {
  assert.equal(createLoader()(utilsPath).getWalletProvider(), null);
  const { globals } = browser(undefined);
  assert.equal(createLoader({}, globals)(utilsPath).getWalletProvider(), null);
  Object.defineProperty(globals.window, "ethereum", {
    get() {
      throw Error("blocked");
    },
  });
  assert.equal(createLoader({}, globals)(utilsPath).getWalletProvider(), null);
});

test("requests keep the provider receiver and distinguish empty accounts from failures", async () => {
  const { api } = browser();
  const provider = {
    async request({ method }) {
      assert.equal(this, provider);
      assert.equal(method, "eth_accounts");
      return [A];
    },
  };
  assert.deepEqual(await api.requestWalletAccounts(provider, "eth_accounts"), [
    A,
  ]);
  for (const result of [null, {}, [null], ["invalid"], [A, 42]]) {
    assert.equal(
      await api.requestWalletAccounts(
        { request: async () => result },
        "eth_accounts",
      ),
      null,
    );
  }
  assert.deepEqual(
    await api.requestWalletAccounts(
      { request: async () => [] },
      "eth_accounts",
    ),
    [],
  );
  for (const provider of [
    {
      request() {
        throw Error("sync failure");
      },
    },
    {
      async request() {
        throw Error("rejected");
      },
    },
    {
      get request() {
        throw Error("bad Proxy getter");
      },
    },
  ]) {
    assert.equal(
      await api.requestWalletAccounts(provider, "eth_requestAccounts"),
      null,
    );
  }
});

test("normal wallet events work without polling and cleanup uses the original provider", () => {
  let listener,
    removed,
    current = A;
  const provider = {
    on(event, fn) {
      assert.equal(this, provider);
      assert.equal(event, "accountsChanged");
      listener = fn;
    },
    removeListener(event, fn) {
      assert.equal(this, provider);
      removed = fn;
    },
  };
  const { api, intervals, globals } = browser(provider);
  const stop = api.watchWalletAccounts(
    provider,
    () => current,
    (address) => {
      current = address;
    },
  );
  assert.equal(intervals.size, 0);
  listener(null);
  listener([null]);
  listener(["invalid"]);
  assert.equal(current, A);
  listener([B]);
  assert.equal(current, B);
  listener([]);
  assert.equal(current, null);
  globals.window.ethereum = brokenProxy();
  stop();
  assert.equal(removed, listener);
  listener([A]);
  assert.equal(current, null);
});

test("broken subscriptions fall back to read-only account changes without replacing a selected lock wallet", async () => {
  let current = null,
    accounts = [A];
  const methods = [];
  const provider = brokenProxy(async ({ method }) => {
    methods.push(method);
    return accounts;
  });
  const { api, intervals, listeners, globals } = browser(provider);
  const stop = api.watchWalletAccounts(
    provider,
    () => current,
    (address) => {
      current = address;
    },
  );
  const poll = intervals.get(1).fn;
  await poll();
  assert.equal(methods.length, 0);
  current = LOCK;
  await poll();
  assert.equal(current, LOCK);
  await poll();
  assert.equal(current, LOCK);
  accounts = [B];
  await listeners.get("focus")();
  assert.equal(current, B);
  accounts = [];
  globals.document.visibilityState = "hidden";
  await poll();
  assert.equal(current, B);
  globals.document.visibilityState = "visible";
  await poll();
  assert.equal(current, null);
  assert.ok(methods.every((method) => method === "eth_accounts"));
  const count = methods.length;
  await poll();
  assert.equal(methods.length, count);
  stop();
});

test("pending fallback requests cannot overwrite a disconnect or update after unmount", async () => {
  let current = A,
    resolve;
  const provider = brokenProxy(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  const { api, intervals } = browser(provider);
  const stop = api.watchWalletAccounts(
    provider,
    () => current,
    (address) => {
      current = address;
    },
  );
  const poll = intervals.get(1).fn;
  const pending = poll();
  await poll(); // Does not start a second request.
  current = null;
  resolve([B]);
  await pending;
  assert.equal(current, null);
  current = A;
  const next = poll();
  stop();
  resolve([]);
  await next;
  assert.equal(current, A);
});

test("failed subscription calls and throwing cleanup methods remain isolated", () => {
  let listener;
  const provider = {
    on(event, fn) {
      listener = fn;
      throw Error("subscribe failed");
    },
    get removeListener() {
      throw Error("cleanup failed");
    },
  };
  const { api } = browser(provider);
  let current = A;
  const stop = api.watchWalletAccounts(
    provider,
    () => current,
    (address) => {
      current = address;
    },
  );
  assert.doesNotThrow(stop);
  listener([B]);
  assert.equal(current, A);
});

function mountConnection(provider, saved = null) {
  const b = browser(provider),
    effects = [],
    state = [];
  const model = {
    currentAddress: null,
    setCurrentAddress(value) {
      model.currentAddress = value;
    },
  };
  b.globals.window.localStorage = {
    getItem: () => saved,
    setItem() {},
    removeItem() {},
  };
  const react = require("react");
  const tag = new Proxy({}, { get: () => "span" });
  const mocks = {
    react: {
      ...react,
      useState: (initial) => {
        const i = state.length;
        state.push(initial);
        return [
          initial,
          (value) => {
            state[i] = value;
          },
        ];
      },
      useEffect: (fn) => effects.push(fn),
      useRef: () => ({ current: null }),
      useCallback: (fn) => fn,
    },
    "mobx-react-lite": { observer: (fn) => fn },
    "../../../model/connection.model": { connectionViewModel: model },
    "./connection.service": {
      useLockWallets: () => ({ data: [], isFetching: false }),
    },
    "./connection.styled": new Proxy(
      {},
      { get: (_, key) => (key === "Button" ? "button" : "span") },
    ),
    "./components/lock-wallets/lock-wallets.component": tag,
    "../account-buttons/account-buttons.component": tag,
    "../glow/glow.component": tag,
    "../robohash-image/robohash-image.component": tag,
    "../spinner/spinner.component": tag,
  };
  const Component = createLoader(
    mocks,
    b.globals,
  )("src/components/common/connection/connection.component.tsx").Connection;
  const tree = Component({});
  const cleanup = effects.map((fn) => fn());
  return {
    ...b,
    model,
    tree,
    state,
    cleanup: () => cleanup.forEach((fn) => fn?.()),
  };
}
function findButton(element) {
  if (!element) return null;
  if (element.type === "button") return element;
  for (const child of [].concat(element.props?.children ?? [])) {
    const button = findButton(child);
    if (button) return button;
  }
  return null;
}

test("the actual Connection mount, Connect click and unmount survive the exact reported Proxy", async () => {
  const methods = [];
  const mounted = mountConnection(
    brokenProxy(async ({ method }) => {
      methods.push(method);
      return [A];
    }),
  );
  assert.equal(methods.length, 0); // Visiting the site never asks to connect.
  await findButton(mounted.tree).props.onClick();
  assert.equal(mounted.model.currentAddress, A);
  assert.deepEqual(methods, ["eth_requestAccounts"]);
  assert.doesNotThrow(mounted.cleanup);
});

test("saved-account failures and denied Connect are handled without unhandled rejections", async () => {
  const mounted = mountConnection(
    brokenProxy(async () => {
      throw Error("rejected");
    }),
    A,
  );
  await new Promise(setImmediate);
  assert.equal(mounted.model.currentAddress, null);
  await findButton(mounted.tree).props.onClick();
  assert.match(mounted.state[1], /Couldn't connect/);
  mounted.cleanup();
});

test("a late saved-account response does not undo a newer accountsChanged event or unmount", async () => {
  let resolve, listener;
  const mounted = mountConnection(
    {
      request: () =>
        new Promise((done) => {
          resolve = done;
        }),
      on(event, fn) {
        listener = fn;
      },
    },
    A,
  );
  listener([B]);
  resolve([A]);
  await new Promise(setImmediate);
  assert.equal(mounted.model.currentAddress, B);
  mounted.cleanup();
  const other = mountConnection(
    {
      request: () =>
        new Promise((done) => {
          resolve = done;
        }),
    },
    A,
  );
  other.cleanup();
  resolve([A]);
  await new Promise(setImmediate);
  assert.equal(other.model.currentAddress, null);
});
