import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import posthog from '@posthog/rollup-plugin';

export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  return defineConfig({
    // base: process.env.PROD ? '/' : '/wattry.com/',
    plugins: [
      react(),
      posthog({
        personalApiKey: process.env.POSTHOG_API_KEY!,
        projectId: process.env.POSTHOG_PROJECT_ID,
        host: process.env.POSTHOG_HOST,
        sourcemaps: {
          enabled: true,
          deleteAfterUpload: true,
        },
      }),
    ],
    root: 'src',
    publicDir: resolve('public'),
    envDir: '..',
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              { name: 'react', test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: 'mui', test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/ }
            ]
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve('./src')
      },
    },
    server: {
      port: 3000
    }
  });
};
