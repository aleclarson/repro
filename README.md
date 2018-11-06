# ts-issue-28383

[Link to issue](https://github.com/Microsoft/TypeScript/issues/28383)

### Directories
- `/issue` holds the problem code
- `/app` tries to use `issue` but `tsc` fails
- `/` is where you run `npm install`

### Steps
1. Install this branch:
```sh
git clone https://github.com/aleclarson/repro.git -b ts-issue-28383 ts-issue-28383 && cd ts-issue-28383
```
2. Run `npm install` to build the project
3. See an error caused by `tsc -p .`

&nbsp;

### Expected
No compiler errors.

### Actual
```
../issue/lib/index.d.ts:2:13 - error TS1166: A computed property name in a class property declaration must refer to an expression whose type is a literal type or a 'unique symbol' type.

2     private [foo];
              ~~~~~

../issue/lib/index.d.ts:2:14 - error TS2304: Cannot find name 'foo'.

2     private [foo];
               ~~~
```

&nbsp;

### `issue/src/index.ts`
```ts
const foo = Symbol('foo')

export class Test {
  private [foo]() {
    return true
  }
}
```

&nbsp;

### `issue/lib/index.d.ts`
```ts
export declare class Test {
    private [foo];
}
```
