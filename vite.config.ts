import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0', // Allow external connections
  },
  preview: {
    port: 3000,
    host: '0.0.0.0'
  },
  build: {
    // Ensure assets are properly hashed and served
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Consistent asset naming for cache busting
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  }
})
