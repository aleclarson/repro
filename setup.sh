cd ./a
yarn

cd ../b
yarn

cd ../c
yarn

cd ../@foo/bar
yarn

cd ../..
git clone https://github.com/aleclarson/jest/tree/sym-v2 jest

cd ./jest
yarn

cd ..
yarn
yarn add link:./jest/packages/jest-haste-map
