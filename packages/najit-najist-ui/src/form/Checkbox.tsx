import { cva, VariantProps } from 'class-variance-authority';
import { DetailedHTMLProps, FC, forwardRef, InputHTMLAttributes } from 'react';

type CheckboxVariantProps = VariantProps<typeof checkboxStyles>;

export const checkboxStyles = cva('h-4 w-4 rounded', {
  variants: {
    size: {
      normal: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6.5 w-6.5',
    },
    color: {
      default: 'border-gray-300 text-green-600 focus:ring-green-600',
    },
    disabled: {
      true: 'opacity-60 bg-gray-100',
      false: '',
    },
  },
  defaultVariants: {
    size: 'normal',
    color: 'default',
  },
});

export const Checkbox = forwardRef<
  HTMLInputElement,
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
    CheckboxVariantProps
>(({ className, color, size, ...rest }, ref) => {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={checkboxStyles({ className, color, size })}
      {...rest}
    />
  );
});
