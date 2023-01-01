import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

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
        sweet:
          'bg-green-300 hover:bg-green-400 focus:ring-bg-green-400 text-white',
      },
    },
    defaultVariants: {
      size: 'normal',
      color: 'normal',
    },
  }
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ children, className, ...rest }, ref) {
    return (
      <button
        ref={ref}
        className={buttonStyles({ className, ...rest })}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
