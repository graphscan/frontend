const assert = require("node:assert/strict");
const { test } = require("node:test");
const { load, createLoader } = require("./helpers/load-typescript.cjs");
const { updateNodeDelay, formatNodeDelay, getDelayThresholdSeconds } = load(
  "src/utils/node-delay.utils.ts",
);

test("normal indexing lag and exactly two minutes do not trigger a warning", () => {
  for (const delay of [0, 7, 16, 120]) {
    const first = updateNodeDelay(delay, undefined, 120, 100_000);
    assert.equal(updateNodeDelay(delay, first, 120, 130_000).isDelayed, false);
  }
});

test("a delay above two minutes must persist for at least one polling interval", () => {
  const first = updateNodeDelay(121, undefined, 120, 100_000);
  assert.equal(first.isDelayed, false);
  const earlyFocusCheck = updateNodeDelay(140, first, 120, 110_000);
  assert.equal(earlyFocusCheck.isDelayed, false);
  const confirmed = updateNodeDelay(151, earlyFocusCheck, 120, 130_000);
  assert.equal(confirmed.isDelayed, true);
  assert.equal(confirmed.delayedSince, 100_000);
});

test("catching up clears the warning and the next spike needs confirmation again", () => {
  const first = updateNodeDelay(200, undefined, 120, 100_000);
  const delayed = updateNodeDelay(230, first, 120, 130_000);
  const recovered = updateNodeDelay(10, delayed, 120, 160_000);
  assert.equal(recovered.isDelayed, false);
  assert.equal(recovered.delayedSince, null);
  assert.equal(updateNodeDelay(200, recovered, 120, 190_000).isDelayed, false);
});

test("stale observations and a backwards clock cannot confirm sustained lag", () => {
  const previous = updateNodeDelay(200, undefined, 120, 100_000);
  for (const now of [99_000, 161_000, 3_700_000]) {
    const resumed = updateNodeDelay(200, previous, 120, now);
    assert.equal(resumed.isDelayed, false);
    assert.equal(resumed.delayedSince, now);
  }
});

test("seconds configuration has a safe default and supports explicit thresholds", () => {
  for (const value of [undefined, "", " ", "invalid", "Infinity", "0", "-1"])
    assert.equal(getDelayThresholdSeconds(value), 120);
  assert.equal(getDelayThresholdSeconds("180"), 180);
  const previous = updateNodeDelay(150, undefined, 180, 100_000);
  assert.equal(updateNodeDelay(150, previous, 180, 130_000).isDelayed, false);
});

test("warning durations are readable in seconds and minutes", () => {
  assert.equal(formatNodeDelay(0), "0 sec");
  assert.equal(formatNodeDelay(7), "7 sec");
  assert.equal(formatNodeDelay(120), "2 min");
  assert.equal(formatNodeDelay(151), "2 min 31 sec");
});

function delayQuery() {
  const state = {
    nodeTimestamp: 1_000,
    headTimestamp: 1_007,
    previous: undefined,
    status: "success",
  };
  const localLoad = createLoader({
    "@tanstack/react-query": {
      useQuery: (key, queryFn, options) => ({ key, queryFn, options }),
      useQueryClient: () => ({
        getQueryData: () => state.previous,
        getQueryState: () => ({ status: state.status }),
      }),
    },
    "../../../services/graphql.service": {
      request: async () => ({
        _meta: { block: { timestamp: state.nodeTimestamp } },
      }),
    },
    "../../../services/web3.service": {
      web3Client: {
        getBlock: async (tag) => {
          assert.equal(tag, "latest");
          return state.headTimestamp === null
            ? null
            : { timestamp: state.headTimestamp };
        },
      },
    },
    "../../../utils/env.utils": {
      getEnvVariables: () => ({ acceptableDelaySeconds: 120 }),
    },
  });
  const query = localLoad(
    "src/layout/components/header/header.service.ts",
  ).useNodeDelay();
  return { state, ...query };
}

test("the real query polls despite global infinite freshness and clears recovered data", async () => {
  const { state, queryFn, options } = delayQuery();
  assert.equal(options.staleTime, 30_000);
  assert.equal(options.refetchInterval, 30_000);
  assert.equal(options.refetchOnWindowFocus, "always");
  assert.equal((await queryFn()).delaySeconds, 7);
  state.headTimestamp = 1_200;
  const first = await queryFn();
  assert.equal(first.isDelayed, false);
  state.previous = {
    ...first,
    observedAt: first.observedAt - 31_000,
    delayedSince: first.delayedSince - 31_000,
  };
  const confirmed = await queryFn();
  assert.equal(confirmed.isDelayed, true);
  state.previous = confirmed;
  state.headTimestamp = 1_003;
  assert.equal((await queryFn()).isDelayed, false);
  state.headTimestamp = 999;
  assert.equal((await queryFn()).delaySeconds, 0);
});

test("failed or missing timestamps do not invent lag or confirm an old observation", async () => {
  const { state, queryFn } = delayQuery();
  state.headTimestamp = 1_200;
  state.previous = updateNodeDelay(200, undefined, 120, Date.now() - 31_000);
  state.status = "error";
  assert.equal((await queryFn()).isDelayed, false);
  for (const timestamp of [null, undefined, NaN, 0]) {
    state.nodeTimestamp = timestamp;
    await assert.rejects(queryFn, /timestamp is unavailable/);
  }
  state.nodeTimestamp = 1_000;
  state.headTimestamp = null;
  await assert.rejects(queryFn, /timestamp is unavailable/);
});
