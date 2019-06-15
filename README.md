# repro/tree/tsc-1

This repro shows how TypeScript forgets to use the `tsconfig.json` of a
dependency whose `main` module has a `.ts` extension.

```sh
# 1. Clone this repository
git clone https://github.com/aleclarson/repro.git -b tsc-1 tsc-1
cd tsc-1

# 2. Setup the clone
yarn && cd foo && yarn && cd ..

# 2. Look in "bar/tsconfig.json" and notice "dom" exists in "lib" array
cat bar/tsconfig.json

# 3. Look in "foo/tsconfig.json" and notice "dom" is *not* in "lib"
cat foo/tsconfig.json

# 4. Open "bar/index.ts" in vscode and notice the error about "console"
code bar/index.ts
```
