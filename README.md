# Repro for NativeScript/NativeScript#11470

With pnpm `nodeLinker: isolated`, transitive deps live under the owning
package's `node_modules` (e.g. `packages/gif/node_modules/<dep>`), not under
the app root or workspace root. `resolveCandidateFilePath` probes only
`projectRoot` and `workspaceRoot`, so the dev server 404s on those modules.

## Run

```sh
npm install
node repro.mjs
```

## Expected

`resolveCandidateFilePath` finds the file, e.g. by probing workspace package
`node_modules` dirs or by resolving the specifier from the importer's
location.

## Actual

```
resolved       : null
-> BUG: returns null -> /ns/m 404 -> dev-session boot fails
```
