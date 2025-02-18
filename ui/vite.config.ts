import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Listify',
        short_name: 'Listify',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: '/Vite.js.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
              "src": "/screenshots/mobile.png",
              "sizes": "1080x1920",
              "type": "image/png",
              "form_factor": "narrow"
          },
          {
              "src": "/screenshots/desktop.png",
              "sizes": "1920x1080",
              "type": "image/png",
              "form_factor": "wide"
          }
      ]
      },
    }),
  ],
});