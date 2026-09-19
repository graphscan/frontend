# Subgraph compatibility checks

The main and analytics URLs in `.env.example` follow their current published versions. A new deployment behind either URL can change the schema without changing the URL.

Use Node.js 24 or newer, install with `yarn install --frozen-lockfile`, and configure `.env` using `.env.example` with a valid `NEXT_PUBLIC_GRAPH_API_KEY`.

```sh
yarn test
yarn check:subgraphs
yarn build
```

For an API key restricted to the site's domain, set `GRAPH_API_ORIGIN=https://graphscan.io` in `.env` or prefix the check command with it. This header is used only by the command-line checker. Browser access from localhost requires a key that allows the local origin.

`check:subgraphs` reads the main, analytics and ENS schemas, checks indexing errors, extracts GraphQL templates and fragments from the actual service files, validates them, and executes small read-only samples. It chooses existing accounts and a subgraph version so detail queries cannot pass with a null entity. Each template is tested with representative inputs; it does not exhaust pagination, all filters or wallet transactions.

Delegation balances and rewards use `DelegatedStake.provision` when present and the indexer pool for legacy stakes with no provision. The updated subgraph uses the same three-part delegation ID before and after Horizon migration. Distinct service pools must remain separate; merging by only the delegator and indexer loses their exchange rates and cost bases.

Horizon `lockedUntil` is a Unix timestamp; legacy values are epoch numbers. The Locked Until column and CSV use `isLegacy` to distinguish them, without guessing from the size of the value. The frontend's existing Locked Tokens column and CSV fields are preserved. Removed wallet transaction controls were not restored.

Known performance limitation: the indexer delegators table fetches every delegation before rendering. Large indexers with over 100,000 stakes can take several minutes to load; the live query checks use small samples and do not validate that full load. Server pagination needs a separate change, including a reliable per-indexer total (the analytics `delegatorsCount` returned zero for an indexer with over 100,000 stakes).

Verified on 2026-09-19:

- Main: `QmR8WQECdNR6TSUf4FfLSFW7D5RDGGkd7F4A6me56pLqJb`
- Analytics: `QmVZJUULM8GEK5FX5yiGKKpHgHHrq2jMML6AQCTrmkn4sG`
- 55 GraphQL templates validated and executed (including ENS).
- 41 regression tests cover legacy fallback, distinct provisions, table/detail consistency, empty pools, CSV values and lock fields, legacy epochs and Horizon timestamps, issuance splits, APR, complete allocation pagination and refreshed network inputs, on-chain reward parameters, minimum signal, active/thawing pool reconciliation, per-service allocation capacity and delay warning recovery.
- Current APR review and remaining priorities: `docs/codebase-review-2026-09-19.md`.

Horizon allocation capacity uses each provision's active self stake and active delegations, capped by its service's delegation ratio. Idle self stake and thawing tokens are excluded. Spare capacity and allocation excess are summed separately across services; missing parameters produce unavailable metrics. Provisions paginate at the original query block. Legacy open allocations remain visible separately from Horizon capacity. Ryabina's 10,354,142.171565458 GRT capacity and over-allocation were verified directly against the contracts; the profile no longer reports thawing funds as available to allocate.

The fixes were ported to `graphscan/frontend` from `main` commit `e35578e`, preserving ethers 6, `NEXT_PUBLIC_*` configuration, existing dependency versions and the lockfile. Type checking, the production static build and a live ethers 6 reward-parameter read passed. Ryabina's full 1,061-row CSV model reconciled with the active delegation pool; the profile and delegation table also rendered in the browser. The GitHub Pages workflow now runs the regression tests before building and uses the current main and analytics subgraph URLs. Deployment still runs on a push to `main`; the checks described above were completed locally before publication.

The delay notice compares the main subgraph's block timestamp with the latest RPC block timestamp, avoiding assumptions about block speed or the visitor's clock. It polls every 30 seconds while the tab is active and refreshes on window focus. A delay must exceed `NEXT_PUBLIC_ACCEPTABLE_DELAY_SECONDS` (default: 120) in observations at least 30 seconds apart before showing a warning; a healthy observation clears it. Old observations after a long pause do not confirm sustained delay. The notice displays minutes and seconds. The old block-based `NEXT_PUBLIC_ACCEPTABLE_DELAY` setting is no longer used.
