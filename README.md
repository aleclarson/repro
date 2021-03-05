# repro

> https://github.com/vitejs/vite/issues/2380

1. Clone this branch

```sh
git clone https://github.com/aleclarson/repro -b vite-2380 vite-2380
cd vite-2380
```

2. Setup the project

```sh
cd vite-plugin-foo && pnpm i && yarn build
cd ../app && pnpm i
```

3. Start up Vite

```sh
yarn dev
```

4. Load `localhost:3000` in a browser

5. Change `app/src/App.tsx` and save it

6. Notice how the page is reloaded

7. Open devtools in browser

8. Goto `/@id/@foo/main.js` and notice two things:
    - the `import.meta.hot.accept` call
    - the `import` of `/@id/__x00__main`

9. Goto `/@id/__x00__main` and notice there isn't really a dead end! You changed `App.tsx` and there was a `hot.accept` callback in `/@id/@foo/main.js` that was never called.
