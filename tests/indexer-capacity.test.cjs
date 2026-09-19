const assert = require("node:assert/strict");
const { test } = require("node:test");
const { load, createLoader } = require("./helpers/load-typescript.cjs");
const { getIndexerCapacity } = load("src/utils/indexer-capacity.utils.ts");
const { transform } = load(
  "src/components/profile/components/profile-tabs/components/indexer-details/indexer-details.model.ts",
);
const { transformToRows, transformToCsvRow } = load(
  "src/components/home/components/home-tabs/components/indexers/indexers.model.ts",
);
const ryabina = require("./fixtures/ryabina-capacity.json");
const wei = (n) => (BigInt(n) * 10n ** 18n).toString();
const pool = (overrides = {}) => ({
  id: "pool",
  tokensProvisioned: wei(100),
  tokensThawing: "0",
  tokensAllocated: wei(500),
  delegatedTokens: wei(1000),
  delegatedThawingTokens: "0",
  dataService: { delegationRatio: 16 },
  ...overrides,
});
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);

test("Ryabina's capacity matches HorizonStaking and exposes the 5.13M shortfall", () => {
  const result = getIndexerCapacity(ryabina.provisions);
  close(result.allocationCapacity, 10354142.171565458);
  assert.equal(result.availableToAllocate, 0);
  close(result.allocationsAboveCapacity, 5131539.150434542);
  close(result.delegationRemaining, 35510863.32843454);
  const details = transform({ ...ryabina, geoHash: null });
  close(details.allocatedTokens, 15485681.322);
  assert.equal(details.availableToAllocate, 0);
  assert.equal(
    details.allocationsAboveCapacity,
    result.allocationsAboveCapacity,
  );
});

test("delegation thawing reduces capacity without changing existing allocations", () => {
  const result = getIndexerCapacity([
    pool({ delegatedThawingTokens: wei(800) }),
  ]);
  assert.equal(result.allocationCapacity, 300);
  assert.equal(result.availableToAllocate, 0);
  assert.equal(result.allocationsAboveCapacity, 200);
});

test("self stake thawing reduces both usable self stake and its delegation limit", () => {
  const result = getIndexerCapacity([
    pool({
      tokensThawing: wei(50),
      delegatedTokens: wei(2000),
      dataService: { delegationRatio: 4 },
    }),
  ]);
  assert.equal(result.allocationCapacity, 250);
  assert.equal(result.delegationRemaining, -1800);
  assert.equal(result.allocationsAboveCapacity, 250);
});

test("unused capacity in another service cannot hide an allocation shortfall", () => {
  const result = getIndexerCapacity([
    pool({ delegatedThawingTokens: wei(800) }),
    pool({
      id: "other",
      tokensAllocated: "0",
      dataService: { delegationRatio: 2 },
    }),
  ]);
  assert.equal(result.allocationCapacity, 600);
  assert.equal(result.availableToAllocate, 300);
  assert.equal(result.allocationsAboveCapacity, 200);
});

test("zero delegation ratios, fully thawing pools and unprovisioned indexers have no fictitious capacity", () => {
  assert.equal(
    getIndexerCapacity([pool({ dataService: { delegationRatio: 0 } })])
      .allocationCapacity,
    100,
  );
  const thawing = getIndexerCapacity([
    pool({ tokensThawing: wei(100), delegatedThawingTokens: wei(1000) }),
  ]);
  assert.equal(thawing.allocationCapacity, 0);
  assert.equal(thawing.allocationsAboveCapacity, 500);
  assert.equal(getIndexerCapacity([]).allocationCapacity, 0);
});

test("unknown active service parameters produce unavailable values instead of assuming 16x", () => {
  assert.equal(
    getIndexerCapacity([pool({ dataService: { delegationRatio: null } })])
      .allocationCapacity,
    null,
  );
  const empty = pool({
    tokensProvisioned: "0",
    delegatedTokens: "0",
    tokensAllocated: "0",
    dataService: { delegationRatio: null },
  });
  assert.equal(getIndexerCapacity([empty]).allocationCapacity, 0);
});

test("whole-wei arithmetic avoids a spurious shortfall at an exact capacity boundary", () => {
  const self = 1000000000000000000000001n;
  const delegated = 2000000000000000000000003n;
  const result = getIndexerCapacity([
    pool({
      tokensProvisioned: String(self),
      delegatedTokens: String(delegated),
      tokensAllocated: String(self + delegated),
    }),
  ]);
  assert.equal(result.availableToAllocate, 0);
  assert.equal(result.allocationsAboveCapacity, 0);
});

test("dashboard and CSV use the same capacity as the profile; unavailable metrics stay empty", () => {
  const rowFor = (provisions) =>
    transformToRows({ favourites: new Map() })({
      indexers: [
        { ...ryabina, provisions, allocations: [], totalAllocations: [] },
      ],
      rewardParameters: null,
      networkStats: {
        totalTokensAllocated: wei(20000000),
        totalTokensSignalled: wei(1000),
      },
    })[0];
  const row = rowFor(ryabina.provisions);
  assert.equal(
    row.delegationRemaining,
    getIndexerCapacity(ryabina.provisions).delegationRemaining,
  );
  assert.equal(
    transformToCsvRow(row)["Remain for Delegation"],
    row.delegationRemaining,
  );
  const unknown = rowFor([pool({ dataService: { delegationRatio: null } })]);
  assert.equal(unknown.delegationRemaining, null);
  assert.equal(unknown.allocationsEffectiveness, null);
  assert.equal(transformToCsvRow(unknown)["Remain for Delegation"], null);
});

test("provisions beyond the first page are loaded at the original block", async () => {
  const queries = [];
  const graph = load("src/services/graphql.service.ts");
  const first = Array.from({ length: 1000 }, (_, i) => pool({ id: String(i) }));
  const loader = createLoader({
    "./graphql.service": {
      ...graph,
      request: async (query) => {
        queries.push(query);
        return { indexer: { provisions: [pool({ id: "1000" })] } };
      },
    },
  });
  const { fetchCapacityProvisions } = loader(
    "src/services/indexer-capacity.service.ts",
  );
  const result = await fetchCapacityProvisions("indexer", first, 42);
  assert.equal(result.length, 1001);
  assert.match(queries[0], /skip: 1000/);
  assert.match(queries[0], /block: \{ number: 42 \}/);
});
