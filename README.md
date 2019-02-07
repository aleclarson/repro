Dependencies installed with `pnpm` are not handled correctly by the TypeScript
server.

Related issue: https://github.com/Microsoft/TypeScript/issues/29806

## Reproduce

1. Ensure `pnpm` is installed (eg: `npm install -g pnpm`)

2. Run the following:

```
git clone -b tss-pnpm https://github.com/aleclarson/repro.git tss-pnpm
cd tss-pnpm
pnpm install
code . --disable-extensions
```

3. Open `src/index.ts`

4. Place the cursor after `produce` and press ctrl+space

5. See that no completions are suggested

&nbsp;

## Solution 1: Use "file:" protocol

When the dependency's version in `package.json` uses the `file:` protocol, the
symlink in `node_modules` (created by `pnpm`) is not a problem. This isn't
an actual solution, because `pnpm` is meant to work without the `file:`
protocol. The TypeScript server should follow the symlinks in `node_modules`
as expected, even when the `file:` protocol is not used.

### Steps

1. Open `src/index.ts`

2. Change `import 'immer'` to `import 'immer-local'`

3. Place the cursor after `produce` and press ctrl+space

4. See that completions work as expected

&nbsp;

## Solution 2: Avoid pnpm

When `npm` is used instead of `pnpm`, symlinks aren't used and auto-completion
works as expected. Obviously, this isn't an actual solution, since I want to
use `pnpm` specifically.

### Steps

1. Run the following:

```
rm -rf node_modules
npm install
```

2. Open `src/index.ts`

3. Place the cursor after `produce` and press ctrl+space

4. See that completions work as expected
