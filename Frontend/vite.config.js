import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://hirehub-ats-3dqk.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  }
})