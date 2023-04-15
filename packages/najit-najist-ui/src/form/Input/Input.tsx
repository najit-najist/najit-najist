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
    Omit<InputVariantProps, 'type' | 'withPrefix' | 'withSuffix'> {
  label?: string;
  hideLabel?: boolean;
  error?: FieldError;
  description?: ReactNode;
  rootClassName?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
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
  'block w-full border border-gray-300 shadow-sm focus:outline-none',
  {
    variants: {
      type: {
        normal: '',
        checkbox: '',
      },
      size: {
        normal: 'py-2 px-3 sm:text-sm',
        md: 'py-3 px-5 sm:text-md',
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
      withSuffix: {
        true: '',
        false: 'rounded-r-md',
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
    suffix,
    wrapperClassName,
    required,
    ...rest
  },
  ref
) {
  const id = useId();

  return (
    <div className={rootClassName}>
      {label ? (
        <Label htmlFor={id} type={hideLabel ? 'invisible' : null}>
          {label}{' '}
          {required ? <span className="text-bold text-red-600">*</span> : ''}
        </Label>
      ) : null}

      <div
        className={cx([
          'flex rounded-md shadow-sm',
          label ? 'mt-1' : '',
          wrapperClassName,
        ])}
      >
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
            withSuffix: !!suffix,
            ...rest,
          })}
          type={type}
          id={id}
          disabled={disabled ?? false}
          required={required}
          {...rest}
        />
        {suffix ? (
          <span className="inline-block rounded-r-md border border-l-0 border-gray-300 text-gray-500 sm:text-sm">
            {suffix}
          </span>
        ) : null}
      </div>

      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      {description && (
        <p className="mt-3 text-sm text-cyan-100">{description}</p>
      )}
    </div>
  );
});
