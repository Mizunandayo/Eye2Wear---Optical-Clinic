import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";
import pluginRewriteAll from "vite-plugin-rewrite-all";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = command === 'build' || mode === 'production';
  
  return {
    plugins: [
      tailwindcss(),
      react(),
      pluginRewriteAll()
    ],
    resolve: {
      alias: {
        // eslint-disable-next-line no-undef
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Explicitly set NODE_ENV for production builds
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
    },
    build: {
      // Enable minification and optimization for production
      minify: isProduction ? 'terser' : false,
      sourcemap: !isProduction,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@material-tailwind/react', '@mui/material', '@radix-ui/react-dialog', '@radix-ui/react-popover'],
            charts: ['apexcharts', 'recharts'],
            utils: ['axios', 'moment', 'moment-timezone', 'uuid'],
            maps: ['mapbox-gl', '@mapbox/mapbox-gl-directions', '@mapbox/mapbox-gl-geocoder']
          }
        }
      }
    },
    server: {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // The backend URL
          changeOrigin: true,
          secure: false,
          headers: {
            Connection: 'keep-alive'
          }
        }
      }
    }
  }
});
