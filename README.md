# bun + chrome-remote-interface

```sh
# 0. Setup the reproduction
git clone https://github.com/aleclarson/repro -b bun-cdp bun-cdp
cd bun-cdp
bun i

# 1. Verify the script works in Node.js
bun tsx index.ts

# 2. Reproduce the issue in Bun
bun run index.ts
```

**How do I know Bun is broken?**

Steps 1 and 2 above should have the same console output, but they don't. When `bun run` is used, the call to `cdp.Page.navigate` hangs indefinitely.
