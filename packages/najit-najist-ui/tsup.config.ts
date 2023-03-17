import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ['esm', 'cjs'],
  tsconfig: './tsconfig.json',
  esbuildOptions(options) {
    options.inject = [...(options.inject || []), './react-shim.js'];
  },
  async onSuccess() {
    const { execa } = await import('execa');

    await execa('tsc', ['--emitDeclarationOnly'], {
      cwd: process.cwd(),
    });
  },
});
