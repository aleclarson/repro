# esbuild-sourcemap-bug

1. Install node_modules

```
yarn
```

2. Build the bundle

```
yarn build
```

3. Set a breakpoint on the first line of `index.js`

4. Run the test

```
yarn test
```

5. Use the `Debug: Attach to Node Process` command in VS Code

6. Once the debugger is attached, continue execution

7. Notice how the breakpoint does not open `index.js`

8. Stop the debugger

9. Open `test.js` and change `USE_ESBUILD` from true to false

10. Repeat steps 4 thru 6

11. Notice how the breakpoint behaves as expected

### Notes

- I suspect it's a bug with esbuild's CommonJS transform

- If you want to verify the bug exists when not using `@ampproject/remapping`, you can set `USE_REMAPPING` to false in `test.js`

- When `USE_ESBUILD` is false, it uses [sucrase](https://github.com/alangpierce/sucrase) instead (which works as expected)
