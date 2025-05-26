import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Load environment variables
const backendUrl = 'https://chatapp-bolum-backend.onrender.com';

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
