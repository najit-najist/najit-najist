import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts'],
  splitting: false,
  sourcemap: true,
  target: 'esnext',
  clean: true,
  dts: true,
  tsconfig: './tsconfig.json',
  treeshake: true,
});
