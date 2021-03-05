import { defineConfig } from 'vite'
import foo from 'vite-plugin-foo'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    foo({ main: 'src/App.tsx' }),
  ],
})
