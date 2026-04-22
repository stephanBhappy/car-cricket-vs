import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      // Convert Vite's blocking <link rel="stylesheet"> to non-blocking after build
      {
        name: 'defer-css',
        enforce: 'post' as const,
        transformIndexHtml(html: string) {
          return html.replace(
            /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
            '<link rel="preload" as="style" onload="this.onload=null;this.rel=\'stylesheet\'" href="$1">',
          );
        },
      },
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'script-defer',
        includeAssets: ['favicon.png', 'icon-192.png', 'icon-512.png', 'icon-512-maskable.png'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        },
        manifest: {
          name: 'Tarmac20 - The Asphalt League',
          short_name: 'Tarmac20',
          description: 'Road trip cricket — spot cars, score runs. Avoid the red car or you\'re out!',
          theme_color: '#0f0f0f',
          background_color: '#0f0f0f',
          display: 'standalone',
          orientation: 'portrait',
          scope: '/',
          start_url: '/?source=pwa',
          id: '/?source=pwa',
          categories: ['games', 'entertainment'],
          screenshots: [
            {
              src: '/landscapeogimage.png',
              sizes: '1200x630',
              type: 'image/png',
              form_factor: 'wide',
              label: 'Tarmac20 game screen',
            },
            {
              src: '/screenshot-1.png',
              sizes: '1080x2100',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Tarmac20 home screen',
            },
            {
              src: '/screenshot-2.png',
              sizes: '1080x2100',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Tarmac20 game screen',
            },
            {
              src: '/screenshot-3.png',
              sizes: '1080x2100',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Tarmac20 scoring screen',
            },
            {
              src: '/screenshot-4.png',
              sizes: '1080x2100',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'Tarmac20 leaderboard',
            },
          ],
          icons: [
            {
              src: '/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/icon-512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
      }),
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-motion': ['motion/react'],
            'vendor-lucide': ['lucide-react'],
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
