# repro

> https://github.com/Swatinem/rollup-plugin-dts/issues/171

1. Clone this branch

```sh
git clone https://github.com/aleclarson/repro -b dts-8-31-2021 dts-repro
cd dts-repro
```

2. Setup the project

```sh
pnpm i
```

3. Try bundling

```sh
yarn rollup -c
```

4. Notice this error

```
[!] TypeError: Cannot read property 'module' of null
TypeError: Cannot read property 'module' of null
    at setAlternativeExporterIfCyclic (~/repro/node_modules/.pnpm/rollup@2.56.3/node_modules/rollup/dist/shared/rollup.js:10754:18)
    at Module.getVariableForExportName (~/repro/node_modules/.pnpm/rollup@2.56.3/node_modules/rollup/dist/shared/rollup.js:10238:17)
    at Module.traceVariable (~/repro/node_modules/.pnpm/rollup@2.56.3/node_modules/rollup/dist/shared/rollup.js:10440:45)
    at ModuleScope.findVariable (~/repro/node_modules/.pnpm/rollup@2.56.3/node_modules/rollup/dist/shared/rollup.js:9227:39)
    at FunctionScope.findVariable (~/repro/node_modules/.pnpm/rollup@2.56.3/node_modules/rollup/dist/shared/rollup.js:3654:38)
    at Identifier.bind (~/repro/node_modules/.pnpm/rollup@2.56.3/node_modules/rollup/dist/shared/rollup.js:4591:40)
    at AssignmentPattern.bind (~/repro/node_modules/.pnpm/rollup@2.56.3/node_modules/rollup/dist/shared/rollup.js:2886:23)
    at FunctionDeclaration.bind (~/repro/node_modules/.pnpm/rollup@2.56.3/node_modules/rollup/dist/shared/rollup.js:2882:31)
    at Program.bind (~/repro/node_modules/.pnpm/rollup@2.56.3/node_modules/rollup/dist/shared/rollup.js:2882:31)
    at Module.bindReferences (~/repro/node_modules/.pnpm/rollup@2.56.3/node_modules/rollup/dist/shared/rollup.js:10055:18)
```

5. Revert the last commit

```
git revert HEAD --no-edit
```

6. Try again to verify workaround

```
yarn rollup -c
cat dist/main.d.ts
```
