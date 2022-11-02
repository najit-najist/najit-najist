import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import image from '@astrojs/image';

// https://astro.build/config
export default defineConfig({
  site: 'http://najitnajit.cz',
  server: {
    host: '0.0.0.0',
    port: process.env.NODE_ENV === 'production' ? 3000 : 3001,
  },
  integrations: [
    react(),
    tailwind(),
    image({ serviceEntryPoint: '@astrojs/image/sharp' }),
  ],
});
