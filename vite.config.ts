import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Get the repository name from package.json
import { name as repoName } from './package.json';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});