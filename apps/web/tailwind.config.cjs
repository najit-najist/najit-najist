/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  safelist: ['instagram_svg__feather'],
  theme: {
    extend: {
      colors: {
        deep: {
          green: {
            300: '#0D8F3C',
            400: '#119447',
            500: '#3f7652',
            700: '#0a4924',
          },
        },
        green: {
          300: '#0D8F3C',
          400: '#119447',
          500: '#3f7652',
          700: '#0a4924',
        },
      },
    },
    fontFamily: {
      sans: ['montserrat', 'sans-serif'],
      fancy: ['playfair-display', 'serif'],
      suez: ['Suez One', 'serif'],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '0.5rem',
        lg: '1rem',
        xl: '4rem',
        '2xl': '6rem',
      },
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
          '.instagram_svg__feather': {
            scale: '0.865',
            marginTop: '-2px',
          },
        });
      },
    },
  ],
};
