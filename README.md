# vite/pull/838

[#838]: https://github.com/vitejs/vite/pull/838

When `vite build` tries to resolve `react` for a library added with `yarn link` or similar,
it searches for `@pika/react` starting from the library root. Since the library has `react`
installed (not `@pika/react`) and the library root is not within the Vite project root,
Vite won't be able to find what `@pika/react` is referring to.

PR [#838] checks the `node_modules` in the Vite project root whenever a dependency cannot
be found.

### How to reproduce

1. Clone this branch:
  ```sh
  git clone https://github.com/aleclarson/repro.git -b vite-838 vite-838
  ```

2. Run the test script:
  ```sh
  ./test.sh
  ```
