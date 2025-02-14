import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    // base: './',
    plugins: [externalizeDepsPlugin()]
  },
  preload: { plugins: [externalizeDepsPlugin()] },
  renderer: {
    resolve: { alias: { '@renderer': resolve('src/renderer/src') } },
    // worker: {
    //   format: 'es'
    // },
    optimizeDeps: { exclude: ['@electric-sql/pglite'] },
    plugins: [react()]
    // ,
    // build: {
    //   outDir: 'dist/renderer',
    //   emptyOutDir: true
    // },
    // define: { global: {} }
  }
})
