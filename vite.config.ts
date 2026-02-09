import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; 

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawApiUrl = env.VITE_API_URL || 'http://dotenv.p-e.kr:8080';
  const apiUrl = rawApiUrl.includes('qick.p-e.kr')
    ? 'http://dotenv.p-e.kr:8080'
    : rawApiUrl;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
