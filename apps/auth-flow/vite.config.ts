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
        secure: false,
        cookieDomainRewrite: {
          "*": "localhost"
        }
      },
      // Proxy auth requests to the auth-flow server
      '/auth': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, ''),
        secure: false,
        cookieDomainRewrite: {
          "*": "localhost"
        }
      },
    },
  },
})
