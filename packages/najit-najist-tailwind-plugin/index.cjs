const formPlugin = require('@tailwindcss/forms');
const plugin = require('tailwindcss/plugin');
const animatePlugin = require('tailwindcss-animate');

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
    '.post-page-content': {
      a: {
        color: '#119447',
        fontWeight: 'bold',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
    '.quill': {
      borderRadius: theme('borderRadius.md'),
      background: theme('colors.white'),
      position: 'relative',
      display: 'flex',
      flexFlow: 'column-reverse',
      borderWidth: theme('borderWidth.2'),
      borderColor: theme('colors.gray.200'),

      '.ql-toolbar': {
        marginTop: '-40px',
        opacity: 0,
        transitionProperty: 'opacity, margin',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDuration: '150ms',
      },
      '.gl-stroke': {
        stroke: `${theme('colors.gray.400')}!important`,
      },

      '.ql-editor': {
        minHeight: '300px',
      },

      '&.is-focusing': {
        '.ql-toolbar': {
          opacity: 1,
          marginTop: '0',
        },
      },
    },
    '.ql-container, .ql-toolbar': {
      border: 'none!important',
    },
    '.ql-toolbar': {
      fontSize: '1rem',
    },
    '.rcp-body': {
      padding: '15px 0',
    },
    '.rcp-fields-element-label': {
      display: 'none',
    },
    '.ql-toolbar': {
      '.ql-picker, .ql-formats>button': {
        borderRadius: theme('borderRadius.md'),

        '&:hover': {
          backgroundColor: theme('colors.gray.100'),
        },
      },
      '.ql-formats>button': {
        padding: '5px!important',
      },
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
    'quill',
    'ql-container',
    'ql-toolbar',
    'ce-block__content',
    'ce-toolbar__content',
    'post-page-content',
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
        ocean: {
          100: '#F2F9FD',
          200: '#CFE9F6',
          300: '#ADD8F0',
          400: '#8AC8EA',
          500: '#5AB2E1',
          600: '#2B9BD9',
          700: '#1F7BAD',
          800: '#16597D',
          900: '#0E374E',
          950: '#0A2636',
        },
      },
      keyframes: {
        bounceZ: {
          '0%, 100%': { transform: 'scale(1.10)' },
          '50%': { transform: 'scale(0.85)' },
        },
      },
      animation: {
        'bounce-z': 'bounceZ 12s linear infinite',
      },
    },
    fontFamily: {
      sans: ['var(--font-montserrat)'],
      suez: ['var(--font-suez)'],
      // By size
      normal: ['var(--font-montserrat)'],
      title: ['var(--font-dm-serif-display)'],
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
  plugins: [formPlugin, tailwindPlugin, animatePlugin],
});

module.exports = {
  plugin: tailwindPlugin,
  getTheme,
};
