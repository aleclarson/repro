# repro/tree/rollup-1

To reproduce:

```sh
# Clone this branch
git clone https://github.com/aleclarson/repro -b rollup-1

# Install and build
yarn && yarn build

# Print the bundle
cat dist/index.js
```
