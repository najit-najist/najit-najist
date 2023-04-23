import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  VariantProps<typeof buttonStyles>;

const buttonStyles = cva(
  'rounded-lg duration-100 focus:ring-2 focus:ring-offset-2 focus:outline-none hover:shadow-lg',
  {
    variants: {
      size: {
        small: 'py-2 px-4 text-sm',
        normal: 'py-2 px-8',
      },
      color: {
        normal: 'bg-deep-green-500 focus:ring-deep-green-400 text-white',
        white:
          'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-semibold',
        sweet:
          'bg-green-300 hover:bg-green-400 focus:ring-bg-green-400 text-white',
        blue: 'bg-indigo-700 hover:bg-indigo-600 text-white border border-indigo-700',
      },
      isLoading: {
        true: 'cursor-wait opacity-70',
        false: '',
      },
    },
    defaultVariants: {
      size: 'normal',
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
