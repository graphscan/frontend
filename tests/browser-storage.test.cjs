const assert = require("node:assert/strict");
const { test } = require("node:test");
const { createLoader } = require("./helpers/load-typescript.cjs");

function memoryStorage(values = {}) {
  const entries = new Map(Object.entries(values));
  return {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
    removeItem: (key) => entries.delete(key),
  };
}
const deny = () => {
  throw new DOMException("Access denied", "SecurityError");
};
const blockedStorage = { getItem: deny, setItem: deny, removeItem: deny };
const defaults = { orderBy: "allocatedTokens", orderDirection: "desc" };
const scope = (storage) => ({ window: { localStorage: storage } });

test("storage access is safe on the server, when the property is blocked, and when methods reject", () => {
  for (const globals of [
    {},
    {
      window: {
        get localStorage() {
          return deny();
        },
      },
    },
    scope(blockedStorage),
  ]) {
    const api = createLoader({}, globals)("src/utils/browser-storage.utils.ts");
    assert.equal(api.readLocalStorage("preference"), null);
    assert.doesNotThrow(() => api.writeLocalStorage("preference", "value"));
    assert.doesNotThrow(() => api.removeLocalStorage("preference"));
  }
});

test("normal storage values round-trip without changing unrelated preferences", () => {
  const storage = memoryStorage({ keep: "existing" });
  const api = createLoader(
    {},
    scope(storage),
  )("src/utils/browser-storage.utils.ts");
  api.writeLocalStorage("test", "value");
  assert.equal(api.readLocalStorage("test"), "value");
  api.removeLocalStorage("test");
  assert.equal(api.readLocalStorage("test"), null);
  assert.equal(storage.getItem("keep"), "existing");
});

test("blocked storage does not crash table construction, pagination, sorting, or error cleanup", () => {
  const { TableViewModel } = createLoader(
    {},
    scope(blockedStorage),
  )("src/model/table.model.ts");
  const table = new TableViewModel("indexers", defaults);
  assert.equal(table.currentPage, 1);
  assert.equal(table.perPage, 15);
  table.setCurrentPage(3);
  table.setPerPage(50);
  table.setSortParams("historicApy");
  table.storageManager.setStoragePerPage(null);
  table.storageManager.setStorageSortParams(null);
  assert.equal(table.currentPage, 1);
  assert.equal(table.perPage, 50);
  assert.equal(table.sortParams.orderBy, "historicApy");
});

test("saved valid table settings survive reload, invalid or stale settings fall back safely", () => {
  for (const saved of [
    "null",
    '"string"',
    "{}",
    "7",
    "{bad json}",
    '{"orderBy":"id","orderDirection":"unknown"}',
  ]) {
    const storage = memoryStorage({
      "indexers-sort-params": saved,
      "indexers-current-page": "Infinity",
      "indexers-per-page": "17",
    });
    const { TableViewModel } = createLoader(
      {},
      scope(storage),
    )("src/model/table.model.ts");
    const table = new TableViewModel("indexers", defaults);
    assert.equal(table.perPage, 15);
    assert.equal(table.currentPage, 1);
    assert.equal(table.sortParams.orderBy, defaults.orderBy);
  }
  const storage = memoryStorage();
  const { TableViewModel } = createLoader(
    {},
    scope(storage),
  )("src/model/table.model.ts");
  const table = new TableViewModel("indexers", defaults);
  table.setPerPage(100);
  table.setSortParams("historicApy");
  table.setCurrentPage(2);
  const restored = new TableViewModel("indexers", defaults);
  assert.equal(restored.currentPage, 2);
  assert.equal(restored.perPage, 100);
  assert.equal(restored.sortParams.orderBy, "historicApy");
});

test("full storage does not prevent table interaction or overwrite saved values", () => {
  const storage = memoryStorage({ "indexers-per-page": "50" });
  storage.setItem = () => {
    throw new DOMException("Quota exceeded", "QuotaExceededError");
  };
  const { TableViewModel } = createLoader(
    {},
    scope(storage),
  )("src/model/table.model.ts");
  const table = new TableViewModel("indexers", defaults);
  assert.equal(table.perPage, 50);
  table.setPerPage(100);
  assert.equal(table.perPage, 100);
  assert.equal(storage.getItem("indexers-per-page"), "50");
});

test("favourites still toggle in memory when storage is blocked or malformed and cannot be cleared", () => {
  for (const storage of [
    blockedStorage,
    { ...blockedStorage, getItem: () => "{invalid" },
  ]) {
    const effects = [];
    const states = [];
    const load = createLoader(
      {
        react: {
          useMemo: (fn) => fn(),
          useCallback: (fn) => fn,
          useEffect: (fn) => effects.push(fn),
          useState: (initial) => {
            const at = states.length;
            states.push(initial);
            return [
              initial,
              (update) => {
                states[at] =
                  typeof update === "function" ? update(states[at]) : update;
              },
            ];
          },
        },
        "./components/checkbox/checkbox.component": {
          Checkbox: (props) => props,
        },
      },
      scope(storage),
    );
    const result = load(
      "src/utils/favourite-column.utils/index.ts",
    ).useFavouriteColumn({
      initialColumns: [],
      favouriteStorageKey: "indexers-favourites",
    });
    assert.doesNotThrow(() => effects.forEach((fn) => fn()));
    result.columns[0]
      .render(false, { id: "indexer" })
      .onChange({ target: { checked: true } });
    assert.ok(states[0].has("indexer"));
    result.columns[0]
      .render(true, { id: "indexer" })
      .onChange({ target: { checked: false } });
    assert.ok(!states[0].has("indexer"));
  }
});

test("application startup no longer depends on unused local/session storage operations", () => {
  const effects = [];
  const load = createLoader(
    {
      react: { ...require("react"), useEffect: (fn) => effects.push(fn) },
      "../layout/layout.component": { Layout: "div" },
      "../styles/styles": { GlobalStyles: "style" },
      "../styles/fonts": { Fonts: "style" },
      "../components/tooltip/tooltip.component": { Tooltip: "div" },
    },
    {
      window: {
        get localStorage() {
          return deny();
        },
      },
      localStorage: blockedStorage,
      sessionStorage: blockedStorage,
    },
  );
  const App = load("src/pages/_app.tsx").default;
  assert.doesNotThrow(() => App({ Component: () => null, pageProps: {} }));
  assert.doesNotThrow(() => effects.forEach((fn) => fn()));
});

test("recovery screen renders useful error details without storage or a working clipboard", async () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const { ApplicationErrorBoundary } = createLoader(
    {},
    { Error, navigator: { clipboard: { writeText: deny } } },
  )(
    "src/components/common/application-error-boundary/application-error-boundary.component.tsx",
  );
  const boundary = new ApplicationErrorBoundary({ children: "healthy page" });
  assert.equal(boundary.render(), "healthy page");
  boundary.state = {
    ...boundary.state,
    ...ApplicationErrorBoundary.getDerivedStateFromError(
      new Error("Test failure"),
    ),
  };
  const html = renderToStaticMarkup(boundary.render());
  assert.match(html, /Unable to load Graphscan/);
  assert.match(html, /Reload page/);
  assert.match(html, /Copy error details/);
  assert.match(html, /Test failure/);
  boundary.setState = (state) => {
    boundary.state = { ...boundary.state, ...state };
  };
  await boundary.copyDetails();
  assert.match(boundary.state.copyStatus, /Open Error details/);
});
