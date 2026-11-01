import { parse } from 'yaml'

console.log(JSON.stringify(parse('a:\n  b: 42\n')))
