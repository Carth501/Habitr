import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  envDir: './environments',
  server: {
    proxy: {
      // Proxy API requests to the habitr-client server
      '/client': {
        target: 'http://localhost:4001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/client/, ''),
      },
      // Proxy auth requests to the auth-flow server
      '/auth': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, ''),
      },
    },
  },
})
