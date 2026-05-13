import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'window',
  },
  server: {
    host: '0.0.0.0',
    port: 5173,

    proxy: {
      '/api': {
        target: 'http://localhost:80',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'http://localhost:80',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:80',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

