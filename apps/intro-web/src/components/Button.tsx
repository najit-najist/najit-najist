import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';
import clsx from 'clsx';

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ children, className, ...rest }, ref) {
    return (
      <button
        ref={ref}
        className={clsx(
          'text-white bg-deep-green-500 rounded-lg py-2 px-8 active:scale-95 duration-100',
          className
        )}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
