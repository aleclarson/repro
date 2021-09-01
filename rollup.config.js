import dts from 'rollup-plugin-dts'

export default {
  input: 'main.ts',
  output: {
    file: 'dist/main.d.ts',
    format: 'esm'
  },
  plugins: [dts({
  respectExternal: true,

  })],
}