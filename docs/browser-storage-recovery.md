# Browser storage and startup recovery

The September 24, 2026 report showed the generic Next.js client-side exception
page in Android Brave at `/#indexers`. That screen does not identify the original
exception. Normal desktop Brave and its Pixel 7 emulation loaded the production
site; the exact exception on the reporting phone was initially unknown. A later
screenshot identified the wallet-provider failure described below.

## Confirmed failure and fix

The application previously read `localStorage` during `_app` rendering and table
construction, and wrote an unused historical-APY timestamp to `sessionStorage`
on mount. These operations can throw `SecurityError` or `QuotaExceededError`.
Favorites and the remembered wallet address also accessed storage without a
complete guard.

Browser storage is now optional. Reads, writes and removals catch failures,
including a throwing `window.localStorage` getter. Tables and favorites retain
their current in-memory state when persistence fails. Valid preferences still
persist normally, while malformed sort settings and invalid pagination values
fall back to defaults. The unused startup storage operations were removed.

An application error boundary offers a reload button and locally displayed,
manually copyable error details for failures caught while rendering or mounting
the component tree. It does not send error reports automatically. It cannot
recover errors that prevent the JavaScript bundle from loading or executing, or
uncaught errors outside that component lifecycle.

## Verification

- 61 tests pass, including denied storage access, full storage, malformed saved
  settings, table interactions, favorites and the recovery screen.
- The production static build passes.
- All 53 live subgraph query checks passed during incident investigation.
- In native Brave with Pixel 7 emulation, a local proxy of the original production
  build reproduced the generic Next.js error page when both browser storage
  getters were made to throw `SecurityError` before hydration.
- The corrected production build with the same injected storage failure loaded
  all 189 indexers and successfully advanced to page 2.

Mobile emulation is not a substitute for verification on the affected Android
device.

## Follow-up: confirmed wallet-provider failure

The recovery screen captured a `TypeError` from an injected Proxy: reading its
immutable `on` property returned a different function, violating JavaScript's
Proxy invariants. The supplied stack points to line 859, column 329 of production
chunk `d4e96052ba9fa26c.js`, at the connection component's unconditional
`window.ethereum.on("accountsChanged", ...)` call. This ran on mount even when
the visitor never clicked Connect. The stack identifies the failing integration;
it does not identify which browser or wallet layer created the faulty Proxy.

Provider discovery, requests, subscription and cleanup now tolerate exceptions
from property reads as well as calls. Normal providers still use account-change
events. If subscribing fails, a visible, connected page checks `eth_accounts`
every 15 seconds and on focus. The first valid result establishes a baseline;
later changes update the account. Unchanged results preserve a selected lock
wallet. Disconnected visitors do not trigger this polling, and only clicking
Connect calls `eth_requestAccounts`.

Invalid account payloads and rejected requests are handled without crashing.
Failed Connect requests display a local message; stale restoration/poll results
cannot overwrite a newer account change or update an unmounted component.

Ten regression tests reproduce the immutable-property Proxy failure, exercise
the actual connection component, and cover healthy providers, account changes,
cleanup, rejected requests and the fallback. The complete suite has 71 tests.

The production build also passed. A local browser harness substituted the same
faulty fixture provider into both bundles (without changing the installed
wallet). In native Brave's Pixel 7 emulation, the previous bundle reproduced the
reported error. The corrected bundle loaded 189 indexers, showed an inline
message when the fixture rejected Connect, and still advanced to page 2.
