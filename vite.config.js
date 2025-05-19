import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    copy: [
      {
        src: 'public/vite.svg',
        dest: 'dist'
      }
    ]
  },
  css: {
    postcss: './postcss.config.js'
  },
  mime: {
    'application/javascript': ['js', 'mjs']
  }
})
