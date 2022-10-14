//
// This import should resolve to…
//   src/pkg/dist/foo.d.ts
//
// …instead of…
//   src/pkg/foo.ts
//
// …because `moduleResolution: node16` is being used, and the
// "src/pkg/package.json" file contains an `exports` field.
//
import {foo} from '@pkg/foo'
console.log(foo)