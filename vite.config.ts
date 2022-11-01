import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: { minify: false },
  mode: 'development',
  optimizeDeps: {
    exclude: ['react-switch'],
  }
})
