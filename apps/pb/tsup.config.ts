import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src'],
  format: ['cjs', 'esm'],
  tsconfig: './tsconfig.json',
  target: 'es5',
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  treeshake: true,
});
