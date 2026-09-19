const assert = require("node:assert/strict");
const { test } = require("node:test");
const { load } = require("./helpers/load-typescript.cjs");
const utils = load("src/utils/delegators.utils.ts");
const root = "src/components/profile/components/profile-tabs/components";
const delegations = load(
  `${root}/delegator-delegations/delegator-delegations.model.ts`,
);
const delegators = load(
  `${root}/indexer-delegators/indexer-delegators.model.ts`,
);
const details = load(`${root}/delegator-details/delegator-details.model.ts`);
const wei = (value) => (BigInt(value) * 10n ** 18n).toString();
const stake = {
  id: "delegator-indexer-service-a",
  isLegacy: false,
  delegator: { id: "delegator" },
  indexer: {
    id: "indexer",
    defaultDisplayName: null,
    delegatedTokens: wei(1000),
    delegatorShares: wei(100),
    delegationExchangeRate: "10",
  },
  provision: {
    id: "indexer-service-a",
    delegatorShares: wei(100),
    delegationExchangeRate: "2",
  },
  shareAmount: wei(10),
  personalExchangeRate: "1.5",
  stakedTokens: wei(20),
  unstakedTokens: wei(7),
  realizedRewards: wei(2),
  createdAt: 10,
  lastDelegatedAt: 20,
  lastUndelegatedAt: 30,
  lockedTokens: "0",
  lockedUntil: 0,
};

test("Horizon uses the provision rate instead of the aggregate indexer rate", () => {
  assert.equal(utils.calcStakeCurrentDelegation(stake), 20e18);
  assert.equal(utils.calcStakeUnrealizedRewards(stake), 5e18);
  assert.equal(utils.calcStakeTotalRewards(stake), 7e18);
  assert.equal(utils.calcRealizedRewards([stake]), 2e18);
  assert.equal(utils.calcUnrealizedRewardsLegacy([stake]), 5e18);
});
test("legacy delegations without a provision retain the indexer rate", () => {
  const legacy = { ...stake, provision: null };
  assert.equal(utils.calcStakeCurrentDelegation(legacy), 100e18);
  assert.equal(utils.calcStakeUnrealizedRewards(legacy), 85e18);
});
test("account totals sum independent pools with distinct exchange rates and cost bases", () => {
  const other = {
    ...stake,
    id: "delegator-indexer-service-b",
    provision: {
      ...stake.provision,
      id: "indexer-service-b",
      delegationExchangeRate: "3",
    },
    personalExchangeRate: "2",
  };
  assert.equal(utils.calcCurrentDelegation([stake, other]), 50e18);
  assert.equal(utils.calcUnrealizedRewards([stake, other]), 15e18);
});
test("both profile tables use the same pool amounts and reward calculations", () => {
  for (const transform of [
    delegations.transformToRow,
    delegators.transformToRow,
  ]) {
    const row = transform(stake);
    assert.equal(row.currentDelegationAmount, 20);
    assert.equal(row.unreleasedReward, 5);
    assert.equal(row.realizedRewards, 2);
  }
  assert.equal(delegations.transformToRow(stake).shareAmount, 0.1);
});
test("different services for the same indexer keep distinct row keys", () => {
  const other = { ...stake, id: "delegator-indexer-service-b" };
  const rows = [stake, other].map(delegations.transformToRow);
  assert.notEqual(rows[0].key, rows[1].key);
  assert.equal(rows[0].id, rows[1].id);
});
test("empty pools produce finite percentages", () => {
  const empty = {
    ...stake,
    shareAmount: "0",
    provision: { ...stake.provision, delegatorShares: "0" },
  };
  const row = delegations.transformToRow(empty);
  assert.equal(row.shareAmount, 0);
  assert.equal(row.unreleasedRewardsPercent, 0);
});
test("delegator details agree with table values", () => {
  const result = details.transformDelegatorDetails({
    id: "delegator",
    activeStakesCount: 1,
    totalStakedTokens: stake.stakedTokens,
    totalUnstakedTokens: stake.unstakedTokens,
    stakes: [stake],
  });
  assert.equal(result.currentDelegations, 20);
  assert.equal(result.totalRewards, 7);
  assert.equal(result.unrealizedRewards, 5);
  assert.equal(result.realizedRewards, 2);
});
test("CSV export retains the corrected rewards", () => {
  const csv = delegations.transformToCsvRow(delegations.transformToRow(stake));
  assert.equal(csv["Current Delegation"], 20);
  assert.equal(csv["Unrealized Rewards"], 5);
  assert.equal(csv["Realized Rewards"], 2);
});

const { formatLockedUntil } = load("src/utils/delegation-lock.utils.ts");
test("Horizon locks display dates from Unix timestamps", () => {
  const formatted = formatLockedUntil(1792148581, false);
  assert.match(formatted, /Oct 16, 2026/);
  assert.doesNotMatch(formatted, /epoch/);
});
test("legacy locks retain their epoch even above the old hard-coded 1132 threshold", () => {
  assert.equal(formatLockedUntil(1388, true), "1388 epoch");
});
test("empty lock timestamps have no displayed date", () => {
  assert.equal(formatLockedUntil(0, false), null);
  assert.equal(formatLockedUntil(null, true), null);
});
test("both profile CSVs preserve locked balances and distinguish legacy epochs from Horizon dates", () => {
  for (const model of [delegations, delegators]) {
    const horizon = model.transformToCsvRow(
      model.transformToRow({
        ...stake,
        lockedTokens: wei(7),
        lockedUntil: 1792148581,
      }),
    );
    assert.equal(horizon["Locked Tokens"], 7);
    assert.match(horizon["Locked Until"], /Oct 16, 2026/);
    const legacy = model.transformToCsvRow(
      model.transformToRow({ ...stake, isLegacy: true, lockedUntil: 1388 }),
    );
    assert.equal(legacy["Locked Until"], "1388 epoch");
  }
});

const indexerDetails = load(`${root}/indexer-details/indexer-details.model.ts`);
const indexerStats = {
  id: "indexer",
  allocatedTokens: "0",
  legacyAllocatedTokens: "0",
  provisions: [],
  delegatorIndexingRewards: "0",
  delegatorQueryFees: "0",
  geoHash: null,
  indexerIndexingRewards: "0",
  queryFeesCollected: "0",
  queryFeeRebates: "0",
  indexingRewardCut: 500000,
  queryFeeCut: 500000,
  ownStakeRatio: "0.5",
  stakedTokens: wei(1000),
  lockedTokens: "0",
  delegatedTokens: "23486228800940118391335406",
  delegatedThawingTokens: "15830028129374660774244144",
};
test("indexer pool splits into active delegation and thawing funds, without adding self stake", () => {
  const result = indexerDetails.transform(indexerStats);
  assert.ok(Math.abs(result.activeDelegatedTokens - 7656200.671565457) < 1e-8);
  assert.equal(
    result.activeDelegatedTokens + result.delegatedThawingTokens,
    result.delegatedTokens,
  );
  assert.ok(Math.abs(result.delegatedTokens - 23486228.800940118) < 1e-8);
});
test("a pool with no thawing has the same active and total delegated balance", () => {
  const result = indexerDetails.transform({
    ...indexerStats,
    delegatedThawingTokens: "0",
  });
  assert.equal(result.activeDelegatedTokens, result.delegatedTokens);
  assert.equal(result.delegatedThawingTokens, 0);
});
