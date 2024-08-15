mkdir -p dist/esbuild

cat a.ts \
  | pnpm esbuild --minify --bundle --loader=ts --format=esm \
  > dist/esbuild/a.js

cat b.ts \
  | pnpm esbuild --minify --bundle --loader=ts --format=esm \
  > dist/esbuild/b.js

DIFF=$(git --no-pager diff --no-index dist/esbuild/a.js dist/esbuild/b.js)

if [ -n "$DIFF" ]; then
  echo "$DIFF"
else
  echo "No differences."
fi
