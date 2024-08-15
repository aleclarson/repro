# esbuild/consistent-minify

The existence of a type import (or lack thereof) affects the minification output of ESBuild. This problem does not occur with Terser.

### Reproduction

1. Install dependencies
   ```sh
   pnpm install
   ```

2. Run the esbuild test
   ```sh
   sh esbuild-minify.sh
   ```

3. Run the terser test
   ```sh
   sh terser-minify.sh
   ```

4. Terser produces a consistent minification output, while ESBuild does not.
