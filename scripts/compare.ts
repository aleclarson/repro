import {parse,parseNative} from 'tsconfck'

const configFile = 'my-app/tsconfig.json'

const [result, nativeResult] = await Promise.all([
  parse(configFile),
  parseNative(configFile),
]);

console.dir({ result, nativeResult }, { depth: null });