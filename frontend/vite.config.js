import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Load environment variables
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/v1': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
