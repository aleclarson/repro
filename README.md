Using `pnpm@2.18.2` to install `lint-staged@8.0.5` makes it impossible to use, due to an error associated with `listr` (used by `lint-staged`). More information is available at: https://github.com/okonet/lint-staged/issues/416

## Steps

1. Install this branch:

```sh
git clone https://github.com/aleclarson/repro.git -b lint-staged-416 lint-staged-416 && cd lint-staged-416
```

2. Run `pnpm install`

3. Trigger `lint-staged` with an empty commit:

```sh
git commit -m 'test' --allow-empty
```

4. See an error about `any-observable`

```
Error: Cannot find any-observable implementation nor global.Observable. You must install polyfill or call require("any-observable/register") with your preferred implementation, e.g. require("any-observable/register")('rxjs') on application load prior to any require("any-observable").
```

## Environment

```
macOS v10.13.6
node v11.1.0
pnpm v2.18.2
```
