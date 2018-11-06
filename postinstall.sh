set -x
tsc="../node_modules/.bin/tsc"

echo "$(tsc --version)"

rm -rf lib
tsc -p .

cd app
  rm -rf lib
  tsc -p .
