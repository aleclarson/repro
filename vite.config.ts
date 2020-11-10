import * as reactPlugin from 'vite-plugin-react'
import type { UserConfig } from 'vite'

const config: UserConfig = {
  jsx: 'react',
  plugins: [reactPlugin],
  sourcemap: true,
  useSystemJs: true,
  // useSystemJs: 'https://unpkg.com/systemjs@6.7.1/dist/s.min.js',
  rollupInputOptions: {
    external: ['react', 'react-dom'],
  }
}

export default config
