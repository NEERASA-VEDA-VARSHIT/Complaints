import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  css: {
    postcss: './postcss.config.js'
  },
  base: './',
  build: {
    assetsDir: '',
    manifest: true
  },
  esbuild: {
    minify: true,
    format: 'esm'
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
})
