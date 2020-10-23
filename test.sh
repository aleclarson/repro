#!/bin/bash

cd react-hello-world
[ ! -d node_modules ] && yarn

cd ../app
[ ! -d node_modules ] && yarn

# This fails.
yarn build
