/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        deep: { green: { 400: '#119447', 500: '#3f7652', 700: '#0a4924' } },
      },
    },
    fontFamily: {
      sans: ['montserrat', 'sans-serif'],
      fancy: ['playfair-display', 'serif'],
    },
  },
  plugins: [
    {
      handler({ addUtilities, addBase }) {
        addUtilities({
          '.text-shadow-sm': {
            textShadow: '#ffffff 0px 0px 6px',
          },
          '.text-shadow': {
            textShadow:
              '#c8c8c8 1px 1px 0px, #b4b4b4 0px 2px 0px, #a0a0a0 0px 3px 0px, rgb(140 140 140 / 50%) 0px 4px 0px, #787878 0px 0px 0px, rgb(0 0 0 / 50%) 0px 5px 10px',
          },
        });

        addBase({
          'input[type=checkbox]:not(:checked) ~ .checkmark svg': {
            display: 'none!important',
          },
        });
      },
    },
  ],
};
