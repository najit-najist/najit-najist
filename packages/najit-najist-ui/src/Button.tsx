import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  VariantProps<typeof buttonStyles>;

export const buttonStyles = cva(
  'rounded-lg duration-100 focus:ring-2 focus:ring-offset-2 focus:outline-none hover:shadow-lg',
  {
    variants: {
      color: {
        normal: 'bg-deep-green-500 focus:ring-deep-green-400 text-white',
        white: 'bg-white text-deep-green-400 shadow font-semibold',
        sweet:
          'bg-green-300 hover:bg-green-400 focus:ring-bg-green-400 text-white',
        blue: 'bg-indigo-700 hover:bg-indigo-600 text-white border border-indigo-700',
        red: 'bg-red-700 hover:bg-red-600 text-white border border-red-700',
        softRed:
          'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200',
      },
      appearance: {
        small: 'py-2 px-4 text-sm',
        spaceless: '',
        normal: 'py-2 px-8',
      },
      isLoading: {
        true: 'cursor-wait opacity-70',
        false: '',
      },
    },
    defaultVariants: {
      appearance: 'normal',
      color: 'normal',
      isLoading: false,
    },
  }
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ children, className, isLoading, ...rest }, ref) {
    return (
      <button
        ref={ref}
        className={buttonStyles({ className, isLoading, ...rest })}
        type="button"
        {...rest}
      >
        {isLoading ? (
          <ArrowPathIcon className="animate-spin w-4 h-4 inline-block mr-2" />
        ) : null}
        <div className="inline-block">{children}</div>
      </button>
    );
  }
);
