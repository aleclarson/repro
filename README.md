### Reproduction

To reproduce the issue, follow these steps:

```sh
# Clone the repository with the specific branch
git clone https://github.com/aleclarson/repro -b tauri-post-localhost tauri-8c247cb
cd tauri-8c247cb

# Install dependencies
pnpm install

# Run the Android emulator, Vite dev server, and Node.js HTTP server
pnpm start
```

- Once the Tauri app is running, fill & submit the form.
- Next, observe the empty request body in the `pnpm start` logs prefixed with `node`.
- Prepend `http://<your-local-ip>:1420` (the port of the Vite dev server) to the form's `action` prop in the `src/App.tsx` file, and the issue will go away. Therefore, it seems `tauri.localhost` is the issue.

### History

This repository was created with the following steps:

1. `pnpm create tauri-app` with the following options:

   - App template: `React + TypeScript`
   - Package manager: `pnpm`

2. `tauri android init`

3. Add a simple HTTP server to the `./server` directory.
