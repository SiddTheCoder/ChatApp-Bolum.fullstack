VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
  manifest: {
    name: 'Bolum Chat App',
    short_name: 'Bolum',
    description: 'A real-time chat app with offline capability',
    theme_color: '#5b21b6',
    background_color: '#ffffff',
    display: 'standalone',
    start_url: '/',
    orientation: 'portrait', // ✅ Add it here
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
    screenshots: [
      {
        src: '/home.png',
        sizes: '1920x1037', 
        type: 'image/png',
        form_factor: 'wide'
      }
    ]
  }
})
