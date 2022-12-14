import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/server.ts'],
  splitting: false,
  sourcemap: true,
  target: 'es5',
  format: ['cjs', 'esm'],
  clean: true,
  dts: true,
  tsconfig: './tsconfig.json',
  treeshake: true,
});
