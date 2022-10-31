/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        deep: { green: { 500: '#3f7652', 700: '#0a4924' } },
      },
    },
  },
  plugins: [],
};
