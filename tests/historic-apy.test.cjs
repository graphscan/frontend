const assert = require("node:assert/strict");
const { test } = require("node:test");
const { load, createLoader } = require("./helpers/load-typescript.cjs");
const {
  calculateHistoricApys,
  getHistoricApy,
  SECONDS_PER_DAY: DAY,
} = load("src/utils/historic-apy.utils.ts");
const END = 1789776000;
const wei = (tokens) => String(BigInt(tokens) * 10n ** 18n);
const snapshot = (days, tokens, shares, thawing = 0) => ({
  dayEnd: String(END - days * DAY),
  delegatedTokens: wei(tokens),
  delegatedThawingTokens: wei(thawing),
  delegatorShares: wei(shares),
  delegationExchangeRate: String((tokens - thawing) / shares),
});
const history = (end = snapshot(0, 1100, 1000)) => ({
  id: "indexer",
  provisions: [{ id: "subgraph-service-pool" }],
  end: [end],
  days30: [snapshot(30, 1000, 1000)],
  days60: [snapshot(60, 1000, 1000)],
  days180: [snapshot(180, 1000, 1000)],
  days360: [snapshot(360, 1000, 1000)],
  lastEmpty: [],
});
const close = (actual, expected) =>
  assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} != ${expected}`);

test("share return includes multiple collects on an open allocation without counting closure again", () => {
  // Two collects (40 + 60 GRT), independent of allocation status/closedAt.
  const before = snapshot(60, 1000, 1000);
  const afterCollects = snapshot(0, 1000 + 40 + 60, 1000);
  const data = { ...history(afterCollects), days60: [before] };
  const expected = 1.1 ** (365 / 60) - 1;
  close(calculateHistoricApys(data, END).periods[60], expected);
  // Closing without another payment doesn't change the share rate.
  close(
    calculateHistoricApys({ ...data, closedAt: END }, END).periods[60],
    expected,
  );
  assert.notEqual(
    expected,
    (0.1 * 365) / 60,
    "APY compounds, unlike linear annualization",
  );
});

test("historical and ending thawing balances are excluded, even when most of the pool is thawing", () => {
  const data = history(snapshot(0, 2600, 1000, 1500));
  data.days60 = [snapshot(60, 1800, 1000, 800)];
  close(calculateHistoricApys(data, END).periods[60], 1.1 ** (365 / 60) - 1);
  data.end = [snapshot(0, 1900, 1000, 800)]; // withdraw 700 already thawing GRT
  close(calculateHistoricApys(data, END).periods[60], 1.1 ** (365 / 60) - 1);
});

test("deposits and undelegation burn/mint shares without creating yield", () => {
  const data = history(snapshot(0, 2500, 2000, 500));
  close(calculateHistoricApys(data, END).periods[60], 0);
  data.end = [snapshot(0, 1000, 300, 700)];
  close(calculateHistoricApys(data, END).periods[60], 0);
});

test("all periods are annualized once and include reinvested query fees", () => {
  const apys = calculateHistoricApys(history(snapshot(0, 1120, 1000)), END);
  for (const days of [30, 60, 180, 360])
    close(apys.periods[days], 1.12 ** (365 / days) - 1);
  const { transformToCsvRow } = load(
    "src/components/home/components/home-tabs/components/indexers/indexers.model.ts",
  );
  const { formatNumberToPercent } = load("src/utils/number.utils.ts");
  const row = { historicApy: apys.periods[60], estFuturePercentReward: null };
  assert.equal(
    transformToCsvRow(row)["Historic APY 60d"],
    formatNumberToPercent(apys.periods[60]),
  );
  assert.equal(
    transformToCsvRow({ ...row, historicApy: null })["Historic APY 60d"],
    null,
  );
});

test("event-free days carry forward; never accept a snapshot after either boundary", () => {
  const data = history(snapshot(2, 1100, 1000));
  data.days60 = [snapshot(64, 1000, 1000)];
  close(calculateHistoricApys(data, END).periods[60], 1.1 ** (365 / 60) - 1);
  data.days60 = [snapshot(59, 1000, 1000)];
  assert.equal(calculateHistoricApys(data, END).periods[60], null);
  data.days60 = [];
  assert.equal(calculateHistoricApys(data, END).periods[60], null);
  data.end = [snapshot(-1, 1100, 1000)];
  assert.equal(calculateHistoricApys(data, END).periods[30], null);
});

test("empty/reset pools and multiple service pools have no comparable APY", () => {
  const data = history();
  data.lastEmpty = [{ dayEnd: String(END - 45 * DAY) }];
  assert.equal(calculateHistoricApys(data, END).periods[60], null);
  assert.notEqual(calculateHistoricApys(data, END).periods[30], null);
  data.lastEmpty = [];
  data.provisions.push({ id: "another-pool" });
  assert.equal(calculateHistoricApys(data, END).periods[30], null);
  data.provisions = [];
  data.end = [{ ...snapshot(0, 0, 1), delegatorShares: "0" }];
  assert.equal(calculateHistoricApys(data, END).periods[60], null);
});

test("reject inconsistent snapshots and invalid numbers; retain real losses", () => {
  for (const overrides of [
    { delegationExchangeRate: "2" },
    { delegationExchangeRate: "NaN" },
    { delegatedThawingTokens: wei(1200) },
    { delegatedTokens: "broken" },
    { delegatedThawingTokens: "-1" },
    { delegatorShares: "0" },
  ]) {
    const data = history({ ...snapshot(0, 1100, 1000), ...overrides });
    assert.equal(calculateHistoricApys(data, END).periods[60], null);
  }
  for (const args of [
    [1, 0, 60],
    [NaN, 1, 60],
    [1, 1, 0],
    [Infinity, 1, 60],
    [1e300, 1, 1],
  ])
    assert.equal(getHistoricApy(...args), null);
  assert.equal(getHistoricApy(0, 1, 60), -1);
  close(getHistoricApy(0.99, 1, 365), -0.01);
});

test("history queries all pages at one analytics block with fixed complete UTC boundaries", async () => {
  const queries = [];
  const graph = load("src/services/graphql.service.ts");
  const first = Array.from({ length: 1000 }, (_, i) => ({
    ...history(),
    id: String(i),
  }));
  const loader = createLoader({
    "./graphql.service": {
      ...graph,
      requestAnalytics: async (query) => {
        queries.push(query);
        if (query.includes("_meta"))
          return {
            _meta: {
              hasIndexingErrors: false,
              block: { number: 42, timestamp: END + 12345 },
            },
          };
        return {
          indexers: query.includes("skip: 1000")
            ? [{ ...history(), id: "1000" }]
            : first,
        };
      },
    },
  });
  const result = await loader(
    "src/services/historic-apy.service.ts",
  ).fetchIndexerHistoricApys();
  assert.equal(result.length, 1001);
  assert.equal(queries.length, 3);
  for (const query of queries.slice(1)) {
    assert.match(query, /block: \{ number: 42 \}/);
    assert.ok(query.includes(`dayEnd_lte: ${END - 60 * DAY}`));
    assert.ok(query.includes(`dayEnd_lte: ${END - 360 * DAY}`));
    assert.match(query, /delegatedThawingTokens/);
    assert.match(query, /delegatorShares: "0"/);
    assert.doesNotMatch(query, /totalAllocations|closedAt|status_not/);
  }
  assert.equal(result[1000].historicApy.endTimestamp, END);
});

test("missing timestamps or indexing errors never produce a fabricated APY", async () => {
  for (const meta of [
    { hasIndexingErrors: false, block: { number: 42, timestamp: null } },
    { hasIndexingErrors: true, block: { number: 42, timestamp: END } },
  ]) {
    const loader = createLoader({
      "./graphql.service": { requestAnalytics: async () => ({ _meta: meta }) },
    });
    await assert.rejects(
      loader("src/services/historic-apy.service.ts").fetchIndexerHistoricApys(),
      /unavailable/,
    );
  }
});

test("floating point noise is zero yield, while meaningful losses remain visible", () => {
  assert.equal(getHistoricApy(1 - Number.EPSILON, 1, 60), 0);
  assert.equal(getHistoricApy(1 + Number.EPSILON, 1, 60), 0);
  assert.ok(getHistoricApy(0.999, 1, 60) < 0);
});

test("Ryabina's recorded 60-day active-share return excludes 15.83M GRT thawing", () => {
  const data = history();
  data.end = [
    {
      dayEnd: "1789689600",
      delegationExchangeRate: "1.525048347801757836",
      delegatedTokens: "23486228800940118391335406",
      delegatedThawingTokens: "15830028129374660774244144",
      delegatorShares: "5020300295791470087658142",
    },
  ];
  data.days60 = [
    {
      dayEnd: "1784419200",
      delegationExchangeRate: "1.496666716084995802",
      delegatedTokens: "23147044288447968575934399",
      delegatedThawingTokens: "95702512859939597391740",
      delegatorShares: "15401786869347966268618208",
    },
  ];
  close(calculateHistoricApys(data, END).periods[60], 0.12106538952820334);
});

test("pending or failed history preserves the current table and never reuses an errored APY", () => {
  let historyResult = {};
  const loader = createLoader({
    react: { useMemo: (fn) => fn() },
    "@tanstack/react-query": {
      useQuery: (key) =>
        key[0] === "indexers-current"
          ? {
              data: [{ id: "indexer", allocatedTokens: "123" }],
              isLoading: false,
            }
          : historyResult,
    },
    "../../../../../../services/network-stats.service": {
      useNetworkStats: () => ({ data: { indexerCount: 1 }, isLoading: false }),
    },
    "../../../../../../services/reward-parameters.service": {
      useRewardParameters: () => ({ data: null }),
    },
  });
  const { useIndexers } = loader(
    "src/components/home/components/home-tabs/components/indexers/indexers.service.ts",
  );
  let result = useIndexers();
  assert.equal(result.isLoading, false);
  assert.equal(result.data.indexers[0].historicApy, null);
  const apy = calculateHistoricApys(history(), END);
  historyResult = { data: [{ id: "indexer", historicApy: apy }] };
  assert.equal(useIndexers().data.indexers[0].historicApy, apy);
  historyResult.error = Error("Analytics unavailable");
  result = useIndexers();
  assert.ok(!result.error);
  assert.equal(result.data.indexers[0].allocatedTokens, "123");
  assert.equal(result.data.indexers[0].historicApy, null);
});
