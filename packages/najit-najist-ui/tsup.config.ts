import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  tsconfig: './tsconfig.json',
  esbuildOptions(options) {
    options.inject = [...(options.inject || []), './react-shim.js'];
  },
});
