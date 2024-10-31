import type { Foo } from "server"

// @ts-expect-error
type Timeout = NodeJS.Timeout

// Just using Foo, nothing that relies on @types/node.
export function commitFoodoku(foo: Foo) {
  console.log(foo)
}
