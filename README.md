# Repro for NativeScript/NativeScript#11471

`extractDirectExportedNames` matches `export` tokens inside comments, so a
CJS module containing `// export const foo` produces a phantom named export
that `expandStarExports` emits as `export { foo } from "<url>"` — a binding
the served module never provides (link-time failure on device).

## Run

```sh
npm install
node repro.mjs
```

## Expected

The scanner ignores commented-out `export` lines; the expanded importer
either lists only real exports or keeps a side-effect import.

## Actual

```
extractDirectExportedNames: [ 'roundRadiusProperty' ]
expanded importer: export { roundRadiusProperty } from "/node_modules/ui-image/index-common.js";
-> BUG: emits an export binding that does not exist in the target
```

Real-world trigger: `@nativescript-community/ui-image`'s `index-common.js`
contains a commented-out `// export const roundRadiusProperty = ...` line;
importing the package over `/ns/m` in a dev session fails at boot.
