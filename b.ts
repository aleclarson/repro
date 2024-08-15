import {
  isPlainObject,
  type BoxedPrimitive,
} from 'radashi'

export function foo(arg: object | BoxedPrimitive<number | string>) {
  return isPlainObject(arg) ? 'object' : 'primitive'
}