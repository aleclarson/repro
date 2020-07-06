# chokidar/issues/1017

The glob `packages/*/package.json` has unexpected behavior, **but only when `pnpm` is used.**

[Link to issue](https://github.com/paulmillr/chokidar/issues/1017)

### Steps

1. Run `./repro.sh` after cloning

2. Expect to see only these logs:
   ```
   add: packages/test/package.json
   ready
   ```

3. Run `node test.js` to try again
