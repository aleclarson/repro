import {Bar} from 'bar'

export type Foo = (bar: Bar) => void
export const foo: Foo = bar => bar()

export {bar} from 'bar'
