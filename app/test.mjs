// @ts-check
import * as vite from "vite";

// Test SSR mode
const server = await vite.createServer({
  server: { middlewareMode: "ssr" },
});

const mod = await server.ssrLoadModule("/main.mjs");
