// vite.config.ts
import path from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  assetsInclude: ['**/*.gltf'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../assets'),
    },
  },
})
