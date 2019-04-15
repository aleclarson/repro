Issue: https://github.com/reframejs/reframe/issues/52

## Directions

1. Try with `yarn link`

```sh
git clone https://github.com/aleclarson/repro -b reframe-1 reframe-bug
cd ./reframe-bug

# Install "react-spring" locally
git clone https://github.com/react-spring/react-spring
cd ./react-spring
yarn
yarn link react-spring

# Link "react-spring" to the repro
cd ..
yarn
yarn link react-spring

# Try building
reframe build
```

2. Try with `ln -s`

```sh
git clone https://github.com/aleclarson/repro -b reframe-1 reframe-bug
cd ./reframe-bug

# Install dependencies
yarn

# Create a package to link to
mv node_modules/react-spring .
ln -s ../react-spring node_modules/react-spring
cd react-spring && yarn

# Try building
reframe build
```

## Created with

```sh
reframe create react-app
```
