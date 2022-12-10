import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  VariantProps<typeof buttonStyles>;

const buttonStyles = cva(
  'text-white bg-deep-green-500 rounded-lg duration-100 focus:ring-deep-green-400 focus:ring-2 focus:ring-offset-2 focus:outline-none hover:shadow-lg',
  {
    variants: {
      size: {
        small: 'py-2 px-4 text-sm',
        normal: 'py-2 px-8 ',
      },
    },
    defaultVariants: {
      size: 'normal',
    },
  }
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ children, className, size, ...rest }, ref) {
    return (
      <button ref={ref} className={buttonStyles({ className, size })} {...rest}>
        {children}
      </button>
    );
  }
);
