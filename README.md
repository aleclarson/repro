# Perry: native YAML parsing fails on a nested mapping

A three-line reproduction using `yaml@2.9.1`, without framework code or file I/O.
Tested with Perry 0.5.1520 and Node v26.12.0 on macOS 27.2 arm64.

```ts
import { parse } from 'yaml'

console.log(JSON.stringify(parse('a:\n  b: 42\n')))
```

Node prints `{"a":{"b":42}}`. Native compilation succeeds, but the executable
throws `TypeError: Cannot read properties of undefined (reading 'type')`.
A flat mapping (`a: 42`) parses successfully.

## Reproduce

Install Node 22.18 or newer and Perry 0.5.1520, with `perry` on PATH. Then run:

```sh
git clone --branch perry-yaml-lockfile --single-branch https://github.com/aleclarson/repro.git perry-yaml-repro
cd perry-yaml-repro
npm ci
npm run repro
```

The check runs the same source under Node and native Perry, prints their exit
codes/output, and fails when they differ. Set `PERRY_BIN` to an absolute path
if Perry is not on PATH. See `verify.mjs` for the exact compile command: all
three strict checks are enabled, JavaScript fallback is unused, and
`--no-auto-optimize` uses the bundled libraries so no Rust checkout is needed.
Generated binaries stay in ignored `dist/`.
