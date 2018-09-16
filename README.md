# rn-symlink

- https://github.com/facebook/react-native/pull/21136

### Steps

1. Install this branch:
```sh
git clone https://github.com/aleclarson/repro.git -b rn-symlink rn-symlink
cd rn-symlink
```

2. Run `./repro`

3. Notice how `metro.config.js` is never loaded, and an error occurs.

4. Run `./fix`

5. Notice that `metro.config.js` is loaded, and no errors occur.
