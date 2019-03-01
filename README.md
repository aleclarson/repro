# jest-symlinks

This repository can be used for testing symlink support in `jest-haste-map`.

## Getting started

1. Ensure you have [yarn][1] and [pnpm][2] installed.

2. Clone this branch:

```sh
git clone https://github.com/aleclarson/repro.git -b jest-symlinks jest-symlinks && cd jest-symlinks
```

3. Run the setup script:

```sh
sh setup.sh
```

4. Run the test script:

```sh
node test.js
```

[1]: https://yarnpkg.com/en/docs/install
[2]: https://pnpm.js.org/docs/en/installation.html

## Notes

The test script triggers some file events, which are ignored by the latest version of `jest-haste-map`.
