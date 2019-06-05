cd bar
yarn --silent

cd ../foo
yarn --silent

# Run tsc
yarn build

# Echo tsc output
echo '\n'
cat lib/index.d.ts
echo '\n'

# Run dts-bundle-generator
yarn build:dts

# Echo dts-bundle-generator output
echo '\n'
cat index.d.ts
echo '\n'
