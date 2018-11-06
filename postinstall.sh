set -x

tsc="../node_modules/.bin/tsc"
tsc --version

cd issue
  rm -rf lib
  tsc -p .
  cd ..

cd app
  rm -rf lib
  tsc -p .
