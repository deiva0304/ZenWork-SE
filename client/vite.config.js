import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Ensure proper build output
  build: {
    outDir: 'dist'
  },
  // Optional: configure proxy for local development
  server: {
    proxy: {
      '/api': {
        target: 'https://zenwork-workplace-wellness-server.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})