import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist', // куда собирать файлы для Vercel
    emptyOutDir: true,           // очищает папку перед билдом
    rollupOptions: {
      output: {
        // хеширование для кеширования браузером
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
      }
    },
    sourcemap: false, // включить для разработки, отключить в продакшне
  },
  server: {
    port: 3000,
    open: true,
  }
})
