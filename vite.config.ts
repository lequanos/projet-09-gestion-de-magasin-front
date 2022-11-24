import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import path from 'path';
import ImportMetaEnvPlugin from '@import-meta-env/unplugin';

// https://vitejs.dev/config/

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    server: {
      host: '0.0.0.0',
      port: 8080,
    },
    base: process.env.BASENAME,
    plugins: [
      react(),
      eslint({
        fix: true,
      }),
      ImportMetaEnvPlugin.vite({
        example: '.env.example',
      }),
    ],
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
  });
};
