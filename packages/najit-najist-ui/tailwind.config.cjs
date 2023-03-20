const { getTheme } = require('@najit-najist/tailwind-plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...getTheme(),
  content: ['./src/**/*.{js,jsx,md,mdx,ts,tsx}'],
};
