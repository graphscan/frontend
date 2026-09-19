const assert = require("node:assert/strict");
const { test } = require("node:test");
const { load, createLoader } = require("./helpers/load-typescript.cjs");
const { getEstimatedRewards } = load("src/model/indexers.model.ts");
const { transformToRows, transformToCsvRow } = load(
  "src/components/home/components/home-tabs/components/indexers/indexers.model.ts",
);
const wei = (grt) => String(grt * 1e18);
const allocation = {
  id: "allocation",
  allocatedTokens: wei(100),
  provision: null,
  subgraphDeployment: {
    id: "deployment",
    signalledTokens: wei(100),
    stakedTokens: wei(1000),
    deniedAt: 0,
  },
};
const params = {
  delegationPool: 1000,
  delegationRemaining: 1000,
  indexingRewardCut: 0.5,
  allocatedTokens: wei(100),
  plannedDelegation: "0",
  networkStats: {
    networkGRTIssuancePerBlock: wei(1),
    totalTokensSignalled: wei(1000),
  },
  allocations: [allocation],
};
function close(actual, expected) {
  assert.ok(
    Math.abs(actual - expected) <= Math.max(1e-12, Math.abs(expected) * 1e-12),
    `${actual} != ${expected}`,
  );
}
const rate = (overrides = {}) =>
  getEstimatedRewards({ ...params, ...overrides }).estFuturePercentReward;

test("current APR uses allocated issuance once, including future issuance splits", () => {
  const at = (issuance) =>
    rate({
      networkStats: {
        ...params.networkStats,
        networkGRTIssuancePerBlock: wei(issuance),
      },
    });
  close(at(96.584) / at(120.73), 0.8);
  close(at(90.584) / at(120.73), 90.584 / 120.73);
  close(at(1), (7150 * 0.1 * 0.1 * 0.5) / 1000);
});
test("denied signal is not deducted a second time from eligible allocations", () => {
  close(
    rate({
      networkStats: {
        ...params.networkStats,
        deniedToTotalSignalledRatio: 0.25,
      },
    }),
    rate(),
  );
  close(
    rate({
      allocations: [
        allocation,
        {
          ...allocation,
          id: "denied",
          subgraphDeployment: {
            ...allocation.subgraphDeployment,
            deniedAt: 123,
          },
        },
      ],
    }),
    rate(),
  );
  assert.equal(
    rate({
      allocations: [
        {
          ...allocation,
          subgraphDeployment: {
            ...allocation.subgraphDeployment,
            deniedAt: 123,
          },
        },
      ],
    }),
    0,
  );
});
test("Horizon uses each provision's normalized indexer cut; legacy uses its own cut", () => {
  const horizon = {
    ...allocation,
    id: "horizon",
    provision: { id: "pool", indexingRewardsCut: "200000" },
  };
  close(
    rate({ allocations: [horizon], indexingRewardCut: 1 }),
    (7150 * 0.1 * 0.1 * 0.8) / 1000,
  );
  close(
    rate({ allocations: [allocation, horizon] }),
    (7150 * 0.1 * 0.1 * (0.5 + 0.8)) / 1000,
  );
});
test("empty pools, empty signal and zero allocations yield finite zero rates", () => {
  for (const overrides of [
    { delegationPool: 0 },
    { allocations: [] },
    { allocatedTokens: "0" },
    { networkStats: { ...params.networkStats, totalTokensSignalled: "0" } },
    {
      allocations: [
        {
          ...allocation,
          subgraphDeployment: {
            ...allocation.subgraphDeployment,
            stakedTokens: "0",
          },
        },
      ],
    },
    { indexingRewardCut: 1 },
  ])
    assert.equal(rate(overrides), 0);
});
test("planned GRT and allocation wei use consistent units and respect remaining capacity", () => {
  close(
    rate({ plannedDelegation: "50" }),
    (7150 * 0.1 * (150 / 1050) * 0.5) / 1050,
  );
  close(
    rate({ plannedDelegation: "50", delegationRemaining: 20 }),
    (7150 * 0.1 * (120 / 1020) * 0.5) / 1050,
  );
  close(
    rate({ plannedDelegation: "50", delegationRemaining: -1 }),
    (7150 * 0.1 * 0.1 * 0.5) / 1050,
  );
});
test("the dashboard excludes thawing GRT and CSV exports its annualized APR", () => {
  const indexer = {
    id: "indexer",
    idOnL2: null,
    defaultDisplayName: null,
    stakedTokens: wei(1000),
    lockedTokens: "0",
    delegatedTokens: wei(1000),
    delegatedThawingTokens: wei(500),
    allocatedTokens: wei(100),
    provisions: [],
    queryFeeCut: 500000,
    indexingRewardCut: 800000,
    legacyIndexingRewardCut: 500000,
    ownStakeRatio: "0.5",
    allocations: [allocation],
    totalAllocations: [],
  };
  const rows = (
    i,
    rewardParameters = { ...params.networkStats, minimumSubgraphSignal: "0" },
  ) =>
    transformToRows({ favourites: new Map() })({
      indexers: [i],
      rewardParameters,
      networkStats: {
        ...params.networkStats,
        totalTokensAllocated: wei(1000),
        deniedToTotalSignalledRatio: 0.25,
      },
    });
  const row = rows(indexer)[0];
  close(
    rows(indexer, {
      ...params.networkStats,
      totalTokensSignalled: wei(2000),
    })[0].estFuturePercentReward,
    rate(),
  );
  assert.equal(rows(indexer, null)[0].estFuturePercentReward, null);
  assert.equal(
    transformToCsvRow(rows(indexer, null)[0])["Current Est. APR"],
    null,
  );
  close(row.estFuturePercentReward, rate() * 2);
  close(
    rows({ ...indexer, delegatedThawingTokens: "0" })[0].estFuturePercentReward,
    rate(),
  );
  assert.equal(
    rows({ ...indexer, delegatedThawingTokens: wei(1000) })[0]
      .estFuturePercentReward,
    0,
  );
  const { formatNumberToPercent } = load("src/utils/number.utils.ts");
  assert.equal(
    transformToCsvRow(row)["Current Est. APR"],
    formatNumberToPercent(row.estFuturePercentReward * 365),
  );
});

test("current allocations paginate beyond 1000 on MAIN; history remains on ANALYTICS", async () => {
  const queries = [];
  const mainCalls = [];
  const historyCalls = [];
  const graph = load("src/services/graphql.service.ts");
  const first = Array.from({ length: 1000 }, (_, i) => ({
    ...allocation,
    id: String(i),
  }));
  const last = { ...allocation, id: "1000" };
  const loader = createLoader({
    react: { useMemo: (fn) => fn() },
    "@tanstack/react-query": {
      useQuery: (key, fn, options) => {
        queries.push({ key, fn, options });
        return {};
      },
    },
    "../../../../../../services/reward-parameters.service": {
      useRewardParameters: () => ({
        data: { ...params.networkStats, minimumSubgraphSignal: "0" },
      }),
    },
    "../../../../../../services/network-stats.service": {
      useNetworkStats: () => ({ data: { indexerCount: 1 } }),
    },
    "../../../../../../services/graphql.service": {
      ...graph,
      request: async (query) => {
        mainCalls.push(query);
        return query.includes("indexer(id:")
          ? { indexer: { allocations: [last] } }
          : {
              indexers: [{ id: "indexer", allocations: first, provisions: [] }],
              _meta: { block: { number: 42 } },
            };
      },
      requestAnalytics: async (query) => {
        historyCalls.push(query);
        return {
          indexers: [{ id: "indexer", totalAllocations: [], dailyData: [] }],
        };
      },
    },
  });
  loader(
    "src/components/home/components/home-tabs/components/indexers/indexers.service.ts",
  ).useIndexers();
  const current = queries.find((q) => q.key[0] === "indexers-current");
  const history = queries.find((q) => q.key[0] === "indexers-history");
  const results = await current.fn();
  assert.equal(results[0].allocations.length, 1001);
  assert.equal(results[0].allocations[1000].id, "1000");
  assert.match(mainCalls[1], /skip: 1000/);
  assert.match(mainCalls[1], /block: \{ number: 42 \}/);
  assert.equal(historyCalls.length, 0);
  await history.fn();
  assert.equal(historyCalls.length, 1);
  assert.ok(current.options.refetchInterval > 0);
  assert.ok(history.options.refetchInterval > current.options.refetchInterval);
  assert.ok(Number.isFinite(current.options.cacheTime));
});

test("a refreshed network rate reaches the table without refetching historical data", () => {
  let networkData = { indexerCount: 1, ...params.networkStats };
  let networkError = null;
  const currentData = [{ id: "indexer", allocations: [] }];
  const historyData = [{ id: "indexer", totalAllocations: [] }];
  const loader = createLoader({
    react: { useMemo: (fn) => fn() },
    "@tanstack/react-query": {
      useQuery: (key) => ({
        data: key[0] === "indexers-current" ? currentData : historyData,
        isLoading: !networkData,
      }),
    },
    "../../../../../../services/reward-parameters.service": {
      useRewardParameters: () => ({
        data: { ...params.networkStats, minimumSubgraphSignal: "0" },
      }),
    },
    "../../../../../../services/network-stats.service": {
      useNetworkStats: () => ({ data: networkData, error: networkError }),
    },
  });
  const { useIndexers } = loader(
    "src/components/home/components/home-tabs/components/indexers/indexers.service.ts",
  );
  assert.equal(
    useIndexers().data.networkStats.networkGRTIssuancePerBlock,
    wei(1),
  );
  networkData = { ...networkData, networkGRTIssuancePerBlock: wei(0.8) };
  assert.equal(
    useIndexers().data.networkStats.networkGRTIssuancePerBlock,
    wei(0.8),
  );
  networkData = undefined;
  networkError = new Error("Network unavailable");
  assert.equal(useIndexers().error, networkError);
  assert.equal(useIndexers().isLoading, false);
});

test("reward parameters use the contract's Curation balance, allocated issuance and minimum signal", async () => {
  let unavailable = false;
  const calls = [];
  const loader = createLoader({
    "./web3.service": { web3Client: {} },
    ethers: {
      Contract: class {
        constructor(address) {
          this.address = address;
        }
        async getAllocatedIssuancePerBlock() {
          if (unavailable) throw new Error("RPC unavailable");
          return 96584000000000000000n;
        }
        async minimumSubgraphSignal() {
          return 0n;
        }
        async balanceOf(address) {
          calls.push([this.address, address]);
          return 11208209445763327815176239n;
        }
      },
    },
  });
  const { fetchRewardParameters } = loader(
    "src/services/reward-parameters.service.ts",
  );
  const contracts = {
    rewardsManager: "rewards",
    graphToken: "token",
    curation: "curation",
  };
  const result = await fetchRewardParameters(contracts);
  assert.equal(result.networkGRTIssuancePerBlock, "96584000000000000000");
  assert.equal(result.totalTokensSignalled, "11208209445763327815176239");
  assert.equal(result.minimumSubgraphSignal, "0");
  assert.deepEqual(calls, [["token", "curation"]]);
  unavailable = true;
  await assert.rejects(fetchRewardParameters(contracts), /RPC unavailable/);
});

test("deployments below the contract's minimum signal do not contribute rewards", () => {
  assert.equal(
    rate({
      networkStats: { ...params.networkStats, minimumSubgraphSignal: wei(101) },
    }),
    0,
  );
  close(
    rate({
      networkStats: { ...params.networkStats, minimumSubgraphSignal: wei(100) },
    }),
    rate(),
  );
});
