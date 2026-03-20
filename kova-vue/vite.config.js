import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/auth': {
        target: 'https://ep-polished-rice-ajlklfzx.neonauth.c-3.us-east-2.aws.neon.tech/neondb/auth',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/auth/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            const setCookie = proxyRes.headers['set-cookie'];
            if (setCookie) {
              proxyRes.headers['set-cookie'] = setCookie.map(cookie => 
                cookie
                  .replace(/Secure;/gi, '')
                  .replace(/SameSite=None;/gi, 'SameSite=Lax;')
                  .replace(/Domain=[^;]+;/gi, '') // Strip Domain
                  .replace(/Path=[^;]+;/gi, 'Path=/;') // Force root Path
              );
            }
          });
        }
      }
    }
  }
})
