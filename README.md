# prettier-tslint-19

Related: https://github.com/azz/prettier-tslint/issues/19

## Steps

```sh
BRANCH="prettier-tslint-19" && git clone https://github.com/aleclarson/repro -b $BRANCH $BRANCH && cd $BRANCH

yarn
./node_modules/.bin/prettier-tslint fix src
cat src/index.ts
```

Using any `typescript` version >=2.9, you should see this error:

```
The 'ordered-imports' rule threw an error in 'src/index.ts':
TypeError: Cannot read property 'text' of undefined
    at Object.getTokenPosOfNode (/Users/alec/dev/sandbox/repro/node_modules/typescript/lib/typescript.js:8984:72)
    at NodeObject.getStart (/Users/alec/dev/sandbox/repro/node_modules/typescript/lib/typescript.js:106669:23)
    at ImportsBlock.getStartOffset (/Users/alec/dev/sandbox/repro/node_modules/tslint/lib/rules/orderedImportsRule.js:351:25)
```
