# vite-588

https://github.com/vitejs/vite/pull/588

### Instructions

1. Clone this branch

2. Run `yarn && yarn build && yarn serve`

3. Open `localhost:5000`

### What's tested?

- `useSystemJs: true` in `vite.config.ts`
- `<script type="systemjs-importmap">` in `index.html`
  - which needs `rollupInputOptions.external` to be defined
- sourcemaps are working as expected
