# Browser storage and startup recovery

The September 24, 2026 report showed the generic Next.js client-side exception
page in Android Brave at `/#indexers`. That screen does not identify the original
exception. Normal desktop Brave and its Pixel 7 emulation loaded the production
site; the exact exception on the reporting phone remains unconfirmed.

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
device. If that device still fails after updating, the recovery screen's error
details can help distinguish another runtime failure from the confirmed storage
failure.
