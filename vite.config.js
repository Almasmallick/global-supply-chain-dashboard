import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          plotly: ['plotly.js-basic-dist-min']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false,
  }
});
