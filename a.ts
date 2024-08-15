import {
  isPlainObject,
} from 'radashi'

export function foo(arg: object | Number | String) {
  return isPlainObject(arg) ? 'object' : 'primitive'
}