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
        // Intercept /s/:code short redirects in local Vite dev server
        if (req.url.startsWith('/s/')) {
          const code = req.url.split('/')[2]?.split('?')[0];
          req.url = `/api/analytics?action=redirect&code=${code}`;
        }

        if (!req.url.startsWith('/api/')) return next();

        const urlObj = new URL(req.url, 'http://localhost:5173');
        let scriptName = urlObj.pathname.replace(/^\/api\//, '').split('/')[0];
        const extraQuery = {};

        // Mirror vercel.json rewrites for local dev
        if (scriptName === 'admin-blogs') { scriptName = 'blogs'; extraQuery.admin = 'true'; }
        else if (scriptName === 'dashboard-trends') { scriptName = 'trends'; extraQuery.view = 'dashboard'; }
        else if (scriptName === 'trends-admin') { scriptName = 'trends'; extraQuery.view = 'admin'; }
        else if (scriptName === 'latest-keywords') { scriptName = 'trends'; extraQuery.view = 'keywords'; }
        else if (scriptName === 'external-services' || scriptName === 'monitor-external') { scriptName = 'seo-stats'; extraQuery.action = 'monitor-external'; }
        else if (scriptName === 'create-order') { scriptName = 'supporters'; extraQuery.action = 'create-order'; }
        else if (scriptName === 'verify-payment') { scriptName = 'supporters'; extraQuery.action = 'verify-payment'; }
        else if (scriptName === 'notebook-pair') {
          const parts = urlObj.pathname.split('/');
          const subAction = parts[3] || '';
          scriptName = 'auth';
          extraQuery.action = `notebook-pair-${subAction}`;
        }
        else if (scriptName === 'notebook-sync') {
          const parts = urlObj.pathname.split('/');
          const subAction = parts[3] || '';
          scriptName = 'auth';
          extraQuery.action = subAction ? `notebook-sync-${subAction}` : 'notebook-sync-push';
        }
        else if (scriptName === 'google-calendar') {
          const parts = urlObj.pathname.split('/');
          const subAction = parts[3] || '';
          const nestedAction = parts[4] || '';
          scriptName = 'auth';
          if (subAction === 'events' && nestedAction === 'create') {
            extraQuery.action = 'google-calendar-events-create';
          } else if (subAction === 'timeline') {
            extraQuery.action = 'google-calendar-timeline';
          } else {
            extraQuery.action = `google-calendar-${subAction}`;
          }
        }
        else if (scriptName === 'shortener') {
          const parts = urlObj.pathname.split('/');
          const subAction = parts[3] || '';
          scriptName = 'analytics';
          extraQuery.action = `shortener-${subAction}`;
        }

        const filePath = path.resolve(process.cwd(), 'api', `${scriptName}.js`);

        if (fs.existsSync(filePath)) {
          try {
            const executeHandler = async (parsedBody) => {
              req.body = parsedBody || {};
              req.query = { ...Object.fromEntries(urlObj.searchParams), ...extraQuery };

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
            };

            if (req.method === 'GET' || req.method === 'HEAD') {
              await executeHandler({});
              return;
            }

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              let parsed = {};
              try { parsed = body ? JSON.parse(body) : {}; } catch { parsed = body; }
              await executeHandler(parsed);
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
    target: 'es2022',
    cssCodeSplit: true,
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const clean = id.replace(/\\/g, '/');
            if (
              clean.includes('/node_modules/react/') ||
              clean.includes('/node_modules/react-dom/') ||
              clean.includes('/node_modules/react-router/') ||
              clean.includes('/node_modules/react-router-dom/') ||
              clean.includes('/node_modules/scheduler/')
            ) {
              return 'vendor-core';
            }
            if (clean.includes('/node_modules/framer-motion/')) {
              return 'vendor-motion';
            }
          }
        }
      }
    }
  }
})
