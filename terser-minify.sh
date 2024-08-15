mkdir -p dist/terser

cat a.ts \
  | pnpm esbuild --bundle --loader=ts --format=esm \
  | pnpm terser -m --toplevel \
  > dist/terser/a.js

cat b.ts \
  | pnpm esbuild --bundle --loader=ts --format=esm \
  | pnpm terser -m --toplevel \
  > dist/terser/b.js

DIFF=$(git --no-pager diff --no-index dist/terser/a.js dist/terser/b.js)

if [ -n "$DIFF" ]; then
  echo "$DIFF"
else
  echo "No differences."
fi
