/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
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
        project: {
          // TODO: finish color changes
          // primary: '#119247',
          // secondary: '#C4F7DA',
          // accent: '#D4681C',
          // background: '#E8FCF1',
          // text: '#052412',

          primary: '#119247',
          secondary: '#119247',
          accent: '#119247',
          background: '#F8FCFA',
          text: '#052412',
          accents: '#052412',

          '-primary': '#6CCC38',
          '-secondary': '#9CDF81',
          '-feature': '#D3F1CA',
        },

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
      screens: {
        xs: '460px',
      },
      borderRadius: {
        project: '1.1rem',
        'project-input': '0.8rem',
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
  content: ['./src/**/*.{js,jsx,md,mdx,ts,tsx}'],
};

export default tailwindConfig;
