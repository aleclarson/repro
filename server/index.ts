// My Foo type does not use this, but @types/node is still leaked
// into my frontend code T_T
import 'express'

export type Foo = { a: number }
