import { cva, cx, VariantProps } from 'class-variance-authority';
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
      'size' | 'color' | 'disabled' | 'prefix'
    >,
    Omit<InputVariantProps, 'type' | 'withPrefix'> {
  label?: string;
  hideLabel?: boolean;
  error?: FieldError;
  description?: ReactNode;
  rootClassName?: string;
  prefix?: ReactNode;
  wrapperClassName?: string;
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
  'block w-full rounded-r-md border border-gray-300 shadow-sm sm:text-sm focus:outline-none',
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
          'focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-400 focus:border-green-400 placeholder-warm-gray-500',
      },
      disabled: {
        true: 'opacity-60 bg-gray-100',
        false: '',
      },
      withPrefix: {
        true: '',
        false: 'rounded-l-md',
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
    prefix,
    wrapperClassName,
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

      <div className={cx(['flex rounded-md shadow-sm', wrapperClassName])}>
        {prefix ? (
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm">
            {prefix}
          </span>
        ) : null}
        <input
          ref={ref}
          className={inputStyles({
            className,
            type: inputTypeToStyleType(type),
            size,
            color,
            disabled,
            withPrefix: !!prefix,
            ...rest,
          })}
          type={type}
          id={id}
          disabled={disabled ?? false}
          {...rest}
        />
      </div>

      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      {description && (
        <p className="mt-3 text-sm text-cyan-100">{description}</p>
      )}
    </div>
  );
});