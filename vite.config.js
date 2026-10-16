import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config();

function localApiPlugin() {
  return {
    name: 'local-api-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/')) return next();

        const urlObj = new URL(req.url, 'http://localhost:5173');
        const scriptName = urlObj.pathname.replace(/^\/api\//, '').split('/')[0];
        const filePath = path.resolve(process.cwd(), 'api', `${scriptName}.js`);

        if (fs.existsSync(filePath)) {
          try {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try { req.body = body ? JSON.parse(body) : {}; } catch { req.body = body; }
              req.query = Object.fromEntries(urlObj.searchParams);

              if (!res.status) {
                res.status = (code) => { res.statusCode = code; return res; };
              }
              if (!res.json) {
                res.json = (data) => {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(data));
                  return res;
                };
              }

              const mod = await import(`file://${filePath}?t=${Date.now()}`);
              const handler = mod.default || mod;
              await handler(req, res);
            });
            return;
          } catch (err) {
            console.error('Local API execution error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message }));
            return;
          }
        }
        next();
      });
    }
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApiPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@excalidraw/excalidraw')) {
              return 'whiteboard';
            }
            if (id.includes('lucide-react')) {
              return 'ui';
            }
            if (id.includes('react') || id.includes('framer-motion') || id.includes('gsap')) {
              return 'vendor';
            }
          }
        }
      }
    }
  }
})
