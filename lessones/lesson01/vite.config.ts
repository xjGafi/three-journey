// vite.config.ts
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../assets'),
    },
  },
})
