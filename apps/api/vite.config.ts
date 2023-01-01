import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv';

dotenv.config();

const { PORT } = process.env;

export default defineConfig({
  server: {
    ...(PORT && { port: Number(PORT) }),
  },
  plugins: [tsconfigPaths()],
});
