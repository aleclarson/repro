# Panda desktop-first breakpoint reproduction

This reproduction uses `@pandacss/dev@2.0.0-beta.15` to show an opt-in preset changing the
meaning of an ordinary `md` responsive key. The source uses `md`, while the generated CSS uses
`@media (max-width: 48rem)` instead of Panda's default min-width selector.

Run:

```sh
pnpm install
pnpm run verify
```

`desktopFirstPreset` adds a custom `md` condition and a parser hook that maps the authored
breakpoint key to that condition before Panda extracts the style. `verify.mjs` runs Panda's build
and fails unless the generated `md` class is inside the max-width media query.

The parser replacement is intentionally minimal and only demonstrates the extension point; it is
not a production parser for arbitrary source code.
