import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import image from '@astrojs/image';

// https://astro.build/config
export default defineConfig({
  site: 'http://najitnajit.cz',
  server: {
    host: '0.0.0.0',
  },
  integrations: [
    react(),
    tailwind(),
    image({ serviceEntryPoint: '@astrojs/image/sharp' }),
  ],
});
