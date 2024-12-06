```
node --experimental-strip-types scripts/compare.ts
```

…outputs the following:

```js
{
  result: {
    tsconfigFile: '/path/to/repro/my-app/tsconfig.json',
    tsconfig: {
      extends: '../tsconfig.json',
      include: [ './' ],
      compilerOptions: { paths: { '@/*': [ './my-app/*', './my-lib/*' ] } }
    },
    extended: [
      {
        tsconfigFile: '/path/to/repro/my-app/tsconfig.json',
        tsconfig: { extends: '../tsconfig.json', include: [ './' ] }
      },
      {
        tsconfigFile: '/path/to/repro/tsconfig.json',
        tsconfig: {
          include: [ './my-lib' ],
          compilerOptions: { paths: { '@/*': [ './my-app/*', './my-lib/*' ] } }
        }
      }
    ]
  },
  nativeResult: {
    tsconfigFile: '/path/to/repro/my-app/tsconfig.json',
    tsconfig: {
      extends: '../tsconfig.json',
      include: [ './' ],
      compilerOptions: { paths: { '@/*': [ './my-app/*', './my-lib/*' ] } }
    },
    result: {
      options: {
        paths: { '@/*': [ './my-app/*', './my-lib/*' ] },
        pathsBasePath: '/path/to/repro',
        configFilePath: '/path/to/repro/my-app/tsconfig.json'
      },
      watchOptions: undefined,
      fileNames: [ '/path/to/repro/my-app/main.ts' ],
      projectReferences: undefined,
      typeAcquisition: { enable: false, include: [], exclude: [] },
      raw: {
        extends: '../tsconfig.json',
        include: [ './' ],
        compileOnSave: false
      },
      errors: [],
      wildcardDirectories: { '/path/to/repro/my-app': 1 },
      compileOnSave: false
    }
  }
}
```

The `result` object is returned by `import("tsconfck").parse(…)`, and the `nativeResult` object is returned by `import("tsconfck").parseNative(…)`.
