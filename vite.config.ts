import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  root: './src', // Ensure correct paths
  base: './', // Fix issues with loading assets
  plugins: [
    react(),
    nodePolyfills({
      // Daftar polyfill yang diperlukan
      include: ['buffer', 'process', 'util']
    })
  ],
  define: {
    // Polyfill untuk process.env
    'process.env': {}
  },
  optimizeDeps: {
    include: ['pouchdb', 'pouchdb-find'] // Pastikan dependensi PouchDB dioptimalkan
  },
  build: {
    commonjsOptions: {
      include: [/pouchdb/, /node_modules/] // Dukungan untuk modul CommonJS
    },
    outDir: '../dist', // Ensure output goes to `dist`
    rollupOptions: {
      input: path.resolve(__dirname, 'src/renderer/index.html')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://68.183.184.176:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
  // necessary for segment analytics lib to work
  // define: { global: {} }
})
