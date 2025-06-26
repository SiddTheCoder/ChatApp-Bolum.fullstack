import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Load environment variables
const backendUrl = 'https://chatapp-bolum-backend.onrender.com';

export default defineConfig({
  plugins: [react(), tailwindcss(),
    VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
    manifest: {
      name: 'Bolum Chat App',
      short_name: 'Bolum',
      description: 'A real-time chat app with offline capability',
      theme_color: '#5b21b6', // purple
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      "screenshots": [
        {
          "src": "/home.png",
          "sizes": "1920x1037",
          "type": "image/png",
          "form_factor": "wide"
        }
      ]
    }
    })]
  ,
  // server: {
  //   proxy: {
  //     '/api/v1': {
  //       target: backendUrl,
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
})
