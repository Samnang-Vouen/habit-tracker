import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      // We register the service worker ourselves via the useRegisterSW
      // React hook (see src/hooks/useUpdateSW.ts), so don't also inject
      // the plugin's own auto-registration script.
      injectRegister: null,
      manifest: {
        name: 'Habit Tracker',
        short_name: 'Habits',
        description: 'Track your daily habits, online or off.',
        theme_color: '#111111',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-72x72.png', sizes: '72x72', type: 'image/png' },
          { src: '/icons/icon-96x96.png', sizes: '96x96', type: 'image/png' },
          { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: '/icons/maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // App shell: every hashed JS/CSS/HTML/font/icon from the build is
        // precached at install time, so the shell loads instantly and works
        // offline with zero network round trips.
        globPatterns: ['**/*.{js,css,html,woff2,png,svg,ico}'],
        navigateFallback: 'index.html',
        // Claim open tabs the moment this worker activates so runtime
        // caching (below) starts capturing API/image responses from the
        // very first visit, not just after a second reload. This is
        // independent of registerType: 'prompt' — skipWaiting stays off,
        // so an *updated* worker still waits for the user to hit Refresh.
        clientsClaim: true,
        runtimeCaching: [
          {
            // Avatar images carry our own cache-busting query param
            // (?updated=<timestamp>), so a given URL's bytes never change.
            // Cache-first means repeat views are instant and offline-safe,
            // with no wasted revalidation request.
            urlPattern: ({ url }) => url.pathname.includes('/storage/v1/object/public/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'avatar-images',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Supabase REST data (habits/daily_logs/profiles) changes
            // whenever the user or another session edits it, so we always
            // try the network first for freshness, falling back to the
            // last-known response only when there is no connection.
            urlPattern: ({ url }) => url.pathname.includes('/rest/v1/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
