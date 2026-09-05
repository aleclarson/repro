import { defineConfig, definePlugin, definePreset } from "@pandacss/dev"

const desktopFirstPlugin = definePlugin({
  name: "desktop-first",
  hooks: {
    "parser:before": ({ content }) => content.replace(/\bmd(?=\s*:)/gu, "_md"),
  },
})

const desktopFirstPreset = definePreset({
  name: "desktop-first",
  conditions: {
    md: "@media (max-width: 48rem)",
  },
  theme: {
    breakpoints: {
      md: "768px",
    },
  },
  plugins: [desktopFirstPlugin],
})

export default defineConfig({
  presets: [desktopFirstPreset],
  include: ["./src/**/*.{ts,tsx}"],
  outdir: "styled-system",
})
