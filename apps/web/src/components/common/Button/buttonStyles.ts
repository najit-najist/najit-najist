import { cva } from 'class-variance-authority';

export const buttonStyles = cva(
  'duration-100 outline-none focus:outline-none aria-disabled:shadow-none disabled:shadow-none aria-disabled:cursor-not-allowed disabled:cursor-not-allowed whitespace-nowrap disabled:bg-opacity-50 aria-disabled:bg-opacity-50 content-center',
  {
    variants: {
      color: {
        primary: '',
        red: '',
        yellow: '',
        blue: '',
        gray: '',
      },
      appearance: {
        // Full color
        solid: '',
        // White background, colored borders
        outlined: 'bg-white border-2',
        // muted background as solid
        filled: '',
        // has padding and everything as filled and solid, but the background of filled is shown after hover
        ghost: '',
        // Without specific padding, margins etc. Just the color is applied to text
        link: 'hover:underline focus:underline',
      },
      size: {
        xsm: 'text-sm',
        sm: 'text-sm',
        normal: '',
        lg: 'text-xl',
        xlg: 'text-2xl',
      },
      animations: {
        true: '',
        false: '',
      },
      isLoading: {
        true: 'cursor-wait opacity-70',
        false: '',
      },
    },
    defaultVariants: {
      appearance: 'solid',
      color: 'primary',
      size: 'normal',
      isLoading: false,
      animations: true,
    },
    compoundVariants: [
      // Misc classes for buttonlike variants
      {
        appearance: ['solid', 'outlined', 'filled', 'ghost'],
        className: 'hover:shadow-sm',
      },
      {
        appearance: ['solid', 'outlined', 'filled', 'ghost'],
        className: 'rounded-project block',
      },
      {
        appearance: ['solid', 'outlined', 'filled', 'ghost'],
        size: 'xsm',
        className: 'px-2 py-1',
      },
      {
        appearance: ['solid', 'outlined', 'filled', 'ghost'],
        size: 'sm',
        className: 'px-4 py-2',
      },
      {
        appearance: ['solid', 'outlined', 'filled', 'ghost'],
        size: 'normal',
        className: 'px-4 py-2',
      },
      {
        appearance: ['solid', 'outlined', 'filled', 'ghost'],
        size: 'lg',
        className: 'px-8 py-2.5',
      },
      {
        appearance: ['solid', 'outlined', 'filled', 'ghost'],
        size: 'xlg',
        className: 'px-8 py-3',
      },

      // Animations classes for buttonlike variants
      {
        appearance: ['solid', 'outlined', 'filled', 'ghost'],
        animations: true,
        className: 'active:scale-[.85] active:ring-2 ring-offset-2',
      },

      // Solid button colors
      {
        appearance: 'solid',
        color: 'primary',
        className:
          'bg-project-primary active:ring-project-primary focus:ring-project-primary text-white',
      },
      {
        appearance: 'solid',
        color: 'red',
        className:
          'bg-red-700 active:ring-red-700 focus:ring-red-700 text-white',
      },
      {
        appearance: 'solid',
        color: 'yellow',
        className:
          'bg-orange-200 active:ring-orange-100 focus:ring-yellow-100 text-orange-600',
      },
      {
        appearance: 'solid',
        color: 'blue',
        className:
          'bg-sky-500 active:ring-sky-500 focus:ring-sky-500 text-white',
      },
      {
        appearance: 'solid',
        color: 'gray',
        className:
          'bg-gray-500 active:ring-gray-500 focus:ring-gray-500 text-white',
      },

      // Outlined button colors
      {
        appearance: 'outlined',
        color: 'primary',
        className:
          'border-project-primary active:text-white focus:text-white active:bg-project-primary focus:bg-project-primary active:ring-project-primary focus:ring-project-primary',
      },
      {
        appearance: 'outlined',
        color: 'red',
        className:
          'border-red-500/10 active:ring-red-500/20 focus:ring-red-500/20',
      },
      {
        appearance: 'outlined',
        color: 'yellow',
        className:
          'border-red-500/10 active:ring-red-500/20 focus:ring-red-500/20',
      },
      {
        appearance: 'outlined',
        color: 'blue',
        className:
          'border-sky-500/10  active:ring-sky-500/20 focus:ring-sky-500/20',
      },
      {
        appearance: 'outlined',
        color: 'gray',
        className:
          'border-gray-500/10  active:ring-gray-500/20 focus:ring-gray-500/20',
      },

      // Filled button colors
      {
        appearance: 'filled',
        color: 'primary',
        className:
          'bg-project--feature focus:bg-project--feature/90 active:bg-project--feature/90 active:ring-project--secondary focus:ring-project--secondary',
      },
      {
        appearance: 'filled',
        color: 'red',
        className:
          'bg-red-100 focus:bg-red-200 active:bg-red-200 active:ring-red-200 focus:ring-red-200',
      },
      {
        appearance: 'filled',
        color: 'yellow',
        className:
          'bg-yellow-100 focus:bg-yellow-200 active:bg-yellow-200 active:ring-yellow-200 focus:ring-yellow-200',
      },
      {
        appearance: 'filled',
        color: 'blue',
        className:
          'bg-sky-500/10 focus:bg-sky-500/2% active:bg-sky-500/20 active:ring-sky-500/20 focus:ring-sky-500/20',
      },
      {
        appearance: 'filled',
        color: 'gray',
        className:
          'bg-gray-500/10 focus:bg-gray-500/20 active:bg-gray-500/20 active:ring-gray-500/20 focus:ring-gray-500/20',
      },

      // Ghost button colors
      {
        appearance: 'ghost',
        color: 'primary',
        className:
          'hover:bg-project--feature/50 focus:bg-project--feature/50 active:ring-project--secondary focus:ring-project--secondary',
      },
      {
        appearance: 'ghost',
        color: 'red',
        className:
          'hover:bg-red-500/20 active:bg-red-500/20 active:ring-red-500/20 focus:ring-red-500/20',
      },
      {
        appearance: 'ghost',
        color: 'yellow',
        className:
          'hover:bg-red-500/20 active:bg-red-500/20 active:ring-red-500/20 focus:ring-red-500/20',
      },
      {
        appearance: 'ghost',
        color: 'blue',
        className:
          'hover:bg-sky-500/2% active:bg-sky-500/20 active:ring-sky-500/20 focus:ring-sky-500/20',
      },
      {
        appearance: 'ghost',
        color: 'gray',
        className:
          'hover:bg-gray-500/20 active:bg-gray-500/20 active:ring-gray-500/20 focus:ring-gray-500/20',
      },

      // 'ghost', 'filled', 'link' text colors
      {
        appearance: ['ghost', 'filled', 'link'],
        color: 'primary',
        className: 'text-project-primary hover:text-project-primary',
      },
      {
        appearance: ['ghost', 'filled', 'link'],
        color: 'red',
        className: 'text-red-500 hover:text-red-700',
      },
      {
        appearance: ['ghost', 'filled', 'link'],
        color: 'yellow',
        className: 'text-yellow-500 hover:text-yellow-700',
      },
      {
        appearance: ['ghost', 'filled', 'link'],
        color: 'blue',
        className: 'text-sky-500 hover:text-sky-700',
      },
      {
        appearance: ['ghost', 'filled', 'link'],
        color: 'gray',
        className: 'text-gray-500 hover:text-gray-700',
      },
    ],
  },
);
