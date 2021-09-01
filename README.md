# repro

> https://github.com/Swatinem/rollup-plugin-dts/issues/172

1. Clone this branch

```sh
git clone https://github.com/aleclarson/repro -b dts-got dts-got
cd dts-got
```

2. Setup the project

```sh
pnpm i
```

3. Try bundling

```sh
yarn rollup -c
```

4. Notice this error

```
main.ts(6,9): error TS2339: Property 'headers' does not exist on type 'CancelableRequest<Response<string>>'.
main.ts(7,9): error TS2339: Property 'body' does not exist on type 'CancelableRequest<Response<string>>'.

[!] (plugin dts) Error: Failed to compile. Check the logs above.
```
