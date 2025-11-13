import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin untuk menangani WASM files dengan MIME type yang benar
    {
      name: 'configure-response-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url.endsWith('.wasm')) {
            res.setHeader('Content-Type', 'application/wasm');
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react-is'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  commonjsOptions: {
    transformMixedEsModules: true,
  },
  define: {
    __APP_NAME__: JSON.stringify('STORI - System Monitoring'),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and related libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI library chunk
          'ui-vendor': ['lucide-react'],
          // Charts library chunk
          'charts-vendor': ['recharts'],
        },
        // Optimize chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Increase chunk size warning limit to 1000kb for better control
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Enable source maps for better debugging in production
  sourcemap: false,
  server: {
    fs: {
      // Allow serving files from public directory
      allow: ['..'],
    },
  },
  // Configure MIME types for static assets
  assetsInclude: ['**/*.wasm', '**/*.onnx'],
  // Configure static asset handling
  publicDir: 'public',
})
