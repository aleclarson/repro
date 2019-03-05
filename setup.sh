cd ./capitalize-name-subreducer
yarn
cp ../immer.* node_modules/immer/dist

cd ../downstream-project
yarn
cp ../immer.* node_modules/immer/dist
