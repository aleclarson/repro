# Bun POST stream abort reproduction

This is a minimal reproduction for a Bun client aborting a streaming `POST`
response without the Bun-hosted `node:http` server observing a close event.

Run:

```sh
bun run repro
```

Expected behavior:

- `GET` abort closes the server-side request or response.
- `POST` abort should also close the server-side request or response.

Observed with Bun 1.3.14:

- `GET` abort emits `GET socket-close`.
- `POST` abort makes the client read reject with `AbortError`, but the server
  does not emit `POST socket-close` or `POST response-close` before the timeout.
