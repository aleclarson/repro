import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const perry = process.env.PERRY_BIN ?? 'perry'
const run = (command, args) => spawnSync(command, args, {
  encoding: 'utf8',
  timeout: args[0] === 'compile' ? 600000 : 15000,
  maxBuffer: 8 * 1024 * 1024,
})
const version = run(perry, ['--version'])
assert.equal(version.status, 0, version.error?.message ?? version.stderr)
console.log(`Node ${process.version}; ${version.stdout.trim()}; ${process.platform}-${process.arch}`)

const expected = run(process.execPath, ['repro.ts'])
assert.equal(expected.status, 0, expected.stderr)
assert.equal(expected.stdout.trim(), '{"a":{"b":42}}')

mkdirSync('dist', { recursive: true })
const binary = resolve('dist', process.platform === 'win32' ? 'repro.exe' : 'repro')
const build = run(perry, [
  'compile', 'repro.ts', '-o', binary,
  '--strict-eval', '--strict-dynamic-import', '--strict-unimplemented',
  '--no-codegen', '--no-auto-optimize', '--march', 'generic',
])
if (build.status !== 0) {
  process.stderr.write(`${build.stdout ?? ''}${build.stderr ?? ''}`)
  throw new Error(`Compilation failed: ${build.error?.message ?? build.status}`)
}
console.log(build.stdout.match(/Found .*module.*$/m)?.[0] ?? 'Compilation succeeded')
const actual = run(binary, [])
console.log('Node:', JSON.stringify({ status: expected.status, stdout: expected.stdout, stderr: expected.stderr }))
console.log('Perry:', JSON.stringify({ status: actual.status, stdout: actual.stdout, stderr: actual.stderr }))
assert.equal(actual.status, expected.status, 'Native execution must succeed')
assert.equal(actual.stdout, expected.stdout, 'Native output must match Node')
assert.equal(actual.stderr, expected.stderr, 'Native stderr must match Node')
