import { cva } from 'class-variance-authority';

export const buttonStyles = cva(
  'duration-100 focus:outline-none hover:shadow-sm disabled:shadow-none disabled:cursor-not-allowed whitespace-nowrap',
  {
    variants: {
      color: {
        noColor: '',
        primary:
          'bg-project-primary focus:ring-project-primary text-white disabled:bg-opacity-50',
        secondary:
          'bg-project-secondary focus:ring-project-secondary text-white disabled:bg-opacity-50',
        /**
         * @deprecated
         */
        normal:
          'bg-project-primary focus:ring-project-primary text-white disabled:bg-opacity-50',
        white:
          'bg-white text-project-secondary font-semibold disabled:bg-gray-100 disabled:opacity-50 border-project-secondary focus:ring-project-secondary border-2',
        sweet:
          'bg-green-300 hover:bg-green-400 focus:ring-green-400 text-white',
        blue: 'bg-blue-400 hover:bg-blue-500 text-white border border-blue-600',
        red: 'bg-red-700 [&:not(:disabled):hover]:bg-red-600 text-white border border-red-700 focus:ring-red-600 disabled:opacity-50',
        softRed:
          'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200',
        subtleRed: 'hover:bg-red-50 text-red-600 border-0',
      },
      appearance: {
        extraSmall: 'py-1 px-3 text-[12px]',
        small: 'py-2 px-4 text-sm',
        spaceless: '',
        normal: 'py-2 px-8',
      },
      size: {
        normal: '',
        lg: 'text-xl px-8 py-3',
      },
      padding: {
        off: '',
        sm: 'py-2 px-4',
        md: 'py-2 px-8',
        xl: 'py-2 px-4',
      },
      asLink: {
        true: 'hover:underline',
        false: '',
      },
      isLoading: {
        true: 'cursor-wait opacity-70',
        false: '',
      },
      notRounded: {
        true: '',
        false: 'rounded-md',
      },
      notAnimated: {
        true: '',
        false: 'hover:scale-[1.02] active:scale-95',
      },
      withoutRing: {
        true: '',
        false: 'focus:ring-2 focus:ring-offset-2 ',
      },
    },
    defaultVariants: {
      appearance: 'normal',
      color: 'normal',
      padding: 'off',
      size: 'normal',
      isLoading: false,
      notRounded: false,
      notAnimated: false,
      withoutRing: false,
    },
    compoundVariants: [
      {
        color: 'noColor',
      },
    ],
  }
);
