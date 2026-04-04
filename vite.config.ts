import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    // Enable Fast Refresh for React components
    fastRefresh: true,
    // Include all files for HMR
    include: "**/*.{jsx,tsx,js,ts}",
  })],
  server: {
    port: 3000,
    open: true,
    // Optimize HMR
    hmr: {
      overlay: true, // Show errors overlay in browser
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
    },
    // Watch for file changes
    watch: {
      usePolling: false, // Set to true if on network drive
      interval: 100,
    },
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: [],
  },
})