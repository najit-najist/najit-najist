const formPlugin = require('@tailwindcss/forms');
const plugin = require('tailwindcss/plugin');

const tailwindPlugin = plugin(({ addBase, addUtilities, theme }) => {
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
    '.ce-block__content': {
      maxWidth: 'unset',
    },
    '.ce-toolbar__content': {
      maxWidth: 'unset',
    },
    '.ce-header': {
      fontWeight: 600,
      fontFamily: theme('fontFamily.sans'),
      marginTop: `${theme('spacing.10')}!important`,
      marginBottom: `${theme('spacing.5')}!important`,
      padding: '0!important',
    },
    'h2.ce-header': {
      fontSize: theme('fontSize.5xl'),
    },
    'h3.ce-header': {
      fontSize: theme('fontSize.3xl'),
    },
    'h4.ce-header': {
      fontSize: theme('fontSize.xl'),
    },
  });
});

/**
 *
 * @returns {Omit<import("tailwindcss").Config, 'content'>}
 */
const getTheme = () => ({
  safelist: [
    'instagram_svg__feather',
    'ce-block__content',
    'ce-header',
    'ce-block__content',
    'ce-toolbar__content',
  ],
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
      sans: ['var(--font-montserrat)'],
      fancy: ['var(--font-playfair-display)'],
      suez: ['var(--font-suez)'],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '0.5rem',
        lg: '1rem',
        xl: '4rem',
        '2xl': '8rem',
      },
    },
  },
  plugins: [formPlugin, tailwindPlugin],
});

module.exports = {
  plugin: tailwindPlugin,
  getTheme,
};
