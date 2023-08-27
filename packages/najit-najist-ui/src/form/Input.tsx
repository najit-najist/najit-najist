import { cva, cx, VariantProps } from 'class-variance-authority';
import {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useId,
} from 'react';
import { FieldError } from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';

import { Label } from './Label';

export type InputVariantProps = VariantProps<typeof inputStyles>;

export interface InputProps
  extends Omit<
      DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      'size' | 'color' | 'disabled' | 'prefix'
    >,
    Omit<
      InputVariantProps,
      'withPrefix' | 'withSuffix' | 'withRightIcon' | 'withLeftIcon'
    > {
  label?: string;
  hideLabel?: boolean;
  error?: FieldError;
  description?: ReactNode;
  rootClassName?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  // leftIcon?: typeof TvIcon;
  // rightIcon?: typeof TvIcon;
  wrapperClassName?: string;
}

const inputTypeToAppearance = (
  type: InputProps['type']
): InputVariantProps['appearance'] => {
  let res: InputVariantProps['appearance'] = 'normal';

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
  'block w-full border-gray-300 shadow-sm focus:outline-none',
  {
    variants: {
      appearance: {
        normal: 'border',
        checkbox: 'border',
        standalone: 'border-b-2',
      },
      size: {
        normal: 'py-[0.55rem] px-3 sm:text-sm',
        md: 'py-3 px-5 sm:text-md',
        lg: 'py-3 px-5 sm:text-xl',
      },
      color: {
        default: 'placeholder-gray-300 focus:border-green-400',
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
      // withLeftIcon: {
      //   true: 'pl-10',
      //   false: '',
      // },
      // withRightIcon: {
      //   true: 'pr-10',
      //   false: '',
      // },
    },
    defaultVariants: {
      appearance: 'normal',
      size: 'normal',
      color: 'default',
      withPrefix: false,
      withSuffix: false,
      // withLeftIcon: false,
      // withRightIcon: false,
    },
    compoundVariants: [
      {
        color: 'default',
        appearance: 'normal',
        className:
          'focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-400',
      },
    ],
  }
);

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type,
    appearance,
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
    // leftIcon,
    // rightIcon,
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
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm bg-white">
            {prefix}
          </span>
        ) : null}
        <input
          ref={ref}
          className={inputStyles({
            className,
            appearance: appearance ?? inputTypeToAppearance(type),
            size,
            color,
            disabled,
            withPrefix: !!prefix,
            withSuffix: !!suffix,
            // withLeftIcon: !!leftIcon,
            // withRightIcon: !!rightIcon,
            ...rest,
          })}
          type={type}
          id={id}
          disabled={disabled ?? false}
          required={required}
          {...rest}
        />
        {suffix ? (
          <span className="inline-block rounded-r-md border border-l-0 border-gray-300 text-gray-500 sm:text-sm bg-white">
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
