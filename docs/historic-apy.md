# Historic delegation APY

The table, tooltip (30/60/180/360 days) and CSV use the annual compounded return of a continuously held active delegation share:

```text
rate = (delegatedTokens - delegatedThawingTokens) / delegatorShares
APY(days) = (rate_end / rate_start) ** (365 / days) - 1
```

This includes reinvested indexing rewards and delegator query fees. Horizon collect payments affect the pool when received, including payments on still-open allocations. Closing an allocation without another payment does not change its share price or count rewards again. Deposits mint shares; undelegation burns active shares and moves tokens to thawing. Withdrawing already thawing tokens does not create a return. Thawing is subtracted in each historical snapshot in integer wei before conversion to a number. The reconstructed rate must agree with the snapshot's reported `delegationExchangeRate`.

This is **APY**, not the previous linear annualization and not a forecast. The separate Current Est. APR remains a current estimate of indexing rewards only. Historic APY excludes entry/exit costs, gas, and returns during withdrawal; it is not an individual delegator's realized return. Indexer cuts and reward-allocation changes are already reflected in the amounts actually credited to the pool.

## Snapshot boundaries and availability

Daily snapshots are updated by events, not necessarily every calendar day. The endpoint is midnight UTC at the start of the latest indexed day. For each boundary, use the most recent snapshot whose `dayEnd` is at or before the boundary, carrying it forward through event-free days. Never use a snapshot after the boundary. Today's incomplete data is excluded; the tooltip shows the exclusive end date. The exponent uses the requested calendar period, not the distance between event-driven snapshot dates.

Metadata, all pages, boundary rates and pool checks use one ANALYTICS block. Five boundary snapshots (end, 30, 60, 180, 360 days ago) and the latest empty-pool snapshot serve every displayed period. At 189 indexers this takes two requests (metadata plus one page), with no allocation downloads or additional hover requests. History refreshes every 30 minutes.

A missing baseline, zero shares, inconsistent rate, or a recorded empty-pool interval produces an unavailable value (`—`, empty CSV cell), not zero yield. An Indexer rate aggregates shares; those shares cannot be compared across different Horizon service pools. Multiple provisions therefore make this aggregate metric unavailable until a pool-specific UI is added. A history request failure leaves the current table usable and clears the unavailable historical metric.

Daily snapshots cannot reveal a pool being emptied and refilled within the same day if its final snapshot is nonempty. Exact detection of every such reset requires event-level pool history that this schema does not expose. The guard detects resets recorded in daily snapshots; it does not claim transaction-level continuity. More generally, the result relies on complete, correct subgraph history. Legitimate losses are preserved rather than clamped to zero; machine-precision rounding around an unchanged rate is normalized to zero.

The Horizon [pool-addition and undelegation handlers](https://github.com/graphprotocol/graph-network-subgraph/blob/master/src/mappings/horizonStaking.ts) update the active share rate when rewards enter and shares leave the pool. The [rate helper](https://github.com/graphprotocol/graph-network-subgraph/blob/master/src/mappings/helpers/helpers.ts) subtracts thawing before dividing by shares. [Horizon delegation documentation](https://thegraph.com/docs/en/resources/roles/delegating/delegating/) describes delegation per data service and automatic migration of existing delegations to SubgraphService.

## Verification — 2026-09-19

ANALYTICS deployment `QmVZJUULM8GEK5FX5yiGKKpHgHHrq2jMML6AQCTrmkn4sG`, block **506847787**, timestamp **1789839514**. Period ends at **2026-09-19 00:00 UTC** (exclusive), the 60-day baseline is **2026-07-21 00:00 UTC**.

| Indexer                                                | Start rate (60 days) |             End rate | Historic APY 60d |
| ------------------------------------------------------ | -------------------: | -------------------: | ---------------: |
| ellipfra, `0xf92f430dd8567b0d466358c79594ab58d919a6d4` | 1.981730835459487390 | 2.085672654624385312 |       36.476854% |
| Ryabina, `0x9da1017766bfeb2835db4f811516eea68996538b`  | 1.496666716084995802 | 1.525048347801757836 |       12.106539% |
| pinax, `0xedca8740873152ff30a2696add66d1ab41882beb`    | 1.805458091323245061 | 1.837806335584130261 |       11.408080% |

For Ryabina the ending active pool is 7,656,200.671565 GRT after excluding 15,830,028.129375 GRT thawing. Its boundary snapshots occur earlier than the calendar boundaries because some days have no events. The carried-forward share rates still cover exactly 60 days.

All 189 indexers were checked. For the 60-day result, 138 have comparable rates; 43 have no active shares at the endpoint, 5 lack a baseline, and 3 have multiple provisions. Independent calculation from the reported share rates agrees with the implementation for every available period. The latest daily rate matches each current Indexer rate in the same live response; every sampled daily snapshot with positive shares matches `(tokens - thawing) / shares`.

Regression tests cover collect payments, closure without a second reward, query fees, deposits, undelegation/withdrawal, historical thawing, missing/empty/reset/multiple pools, event-free days, boundaries, losses, numerical safeguards, paginated reads at one block, CSV annualization and history failure isolation. Live schema/execution checks cover 53 application queries; production build and local table/tooltip checks pass.
