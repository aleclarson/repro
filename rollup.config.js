import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/index.ts',
  output: {
    file: require('./package.json').main,
    format: 'cjs',
  },
  plugins: [typescript(), resolve(), commonjs()],
}
