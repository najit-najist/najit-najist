import { cva, VariantProps } from 'class-variance-authority';
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from 'react';

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
      true: 'opacity-50 bg-gray-100',
      false: '',
    },
  },
  defaultVariants: {
    size: 'normal',
    color: 'default',
  },
});

export type CheckboxProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'size'
> &
  CheckboxVariantProps;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, color, size, disabled, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={checkboxStyles({ className, color, size, disabled })}
        disabled={disabled}
        {...rest}
      />
    );
  }
);
