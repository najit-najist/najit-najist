import { cva, VariantProps } from 'class-variance-authority';
import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useId,
} from 'react';
import { FieldError } from 'react-hook-form';
import { ErrorMessage } from '../ErrorMessage';

import { Label } from '../Label';

type InputVariantProps = VariantProps<typeof inputStyles>;

export interface InputProps
  extends Omit<
      DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      'size' | 'color' | 'disabled'
    >,
    Omit<InputVariantProps, 'type'> {
  label?: string;
  hideLabel?: boolean;
  error?: FieldError;
  description?: ReactNode;
  rootClassName?: string;
}

const inputTypeToStyleType = (
  type: InputProps['type']
): InputVariantProps['type'] => {
  let res: InputVariantProps['type'] = 'normal';

  switch (type) {
    case 'checkbox': {
      res = 'checkbox';
      break;
    }
    default: {
      break;
    }
  }

  return res;
};

export const inputStyles = cva(
  'block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm focus:outline-none',
  {
    variants: {
      type: {
        normal: '',
        checkbox: '',
      },
      size: {
        normal: 'py-2 px-3',
        md: 'py-3 px-5',
      },
      color: {
        default:
          'focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-700 placeholder-warm-gray-500',
      },
      disabled: {
        true: 'opacity-60 bg-gray-100',
        false: '',
      },
    },
    defaultVariants: {
      type: 'normal',
      size: 'normal',
      color: 'default',
    },
  }
);

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type,
    className,
    label,
    hideLabel,
    error,
    description,
    size,
    color,
    rootClassName,
    disabled,
    ...rest
  },
  ref
) {
  const id = useId();

  return (
    <div className={rootClassName}>
      {label && (
        <Label htmlFor={id} type={hideLabel ? 'invisible' : null}>
          {label}
        </Label>
      )}

      <input
        ref={ref}
        className={inputStyles({
          className,
          type: inputTypeToStyleType(type),
          size,
          color,
          disabled,
          ...rest,
        })}
        type={type}
        id={id}
        disabled={disabled ?? false}
        {...rest}
      />

      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      {description && (
        <p className="mt-3 text-sm text-cyan-100">{description}</p>
      )}
    </div>
  );
});
