import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
