import { cva, cx, VariantProps } from 'class-variance-authority';
import { forwardRef, ReactNode, useId } from 'react';
import { FieldError } from 'react-hook-form';

import { ErrorMessage } from './ErrorMessage';
import { Label } from './Label';

export type InputVariantProps = VariantProps<typeof inputStyles>;

export interface InputProps
  extends Omit<
      React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
      'size' | 'color' | 'disabled' | 'prefix'
    >,
    Omit<
      InputVariantProps,
      | 'withPrefix'
      | 'withSuffix'
      | 'withRightIcon'
      | 'withLeftIcon'
      | 'readOnly'
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
  type: InputProps['type'],
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
  'block w-full border-project focus:outline-none',
  {
    variants: {
      appearance: {
        normal: 'bg-white',
        checkbox: '',
        standalone: 'border-b-2',
      },
      size: {
        normal: 'py-[0.55rem] px-3 sm:text-sm',
        md: 'py-3 px-5 sm:text-md',
        lg: 'py-3 px-5 sm:text-xl',
      },
      color: {
        default: 'placeholder-gray-300',
      },
      disabled: {
        true: 'opacity-60 bg-gray-100',
        false: '',
      },
      withPrefix: {
        true: '',
        false: 'rounded-l-project-input',
      },
      withSuffix: {
        true: '',
        false: 'rounded-r-project-input',
      },
      readOnly: {
        true: '!border-gray-200 !focus:border-gray-200 !ring-0 !shadow-none cursor-default',
        false: '',
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
      readOnly: false,
      disabled: false,
      // withLeftIcon: false,
      // withRightIcon: false,
    },
    compoundVariants: [
      {
        color: 'default',
        appearance: 'normal',
        readOnly: false,
        className:
          'focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-green-400',
      },
      {
        color: 'default',
        readOnly: false,
        className: 'focus:border-green-400',
      },
    ],
  },
);

export const inputPrefixSuffixStyles = cva(
  'inline-block border-project text-gray-500 sm:text-sm bg-white',
  {
    variants: {
      type: {
        prefix: 'rounded-l-project-input !border-r-0',
        suffix: 'rounded-r-project-input !border-l-0',
      },
      centerContent: {
        true: 'flex items-center justify-center',
        false: '',
      },
    },
    defaultVariants: {
      centerContent: false,
    },
  },
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
    readOnly,
    id: idOverride,
    // leftIcon,
    // rightIcon,
    ...rest
  },
  ref,
) {
  const id = useId();

  return (
    <div className={rootClassName}>
      {label ? (
        <Label htmlFor={idOverride ?? id} type={hideLabel ? 'invisible' : null}>
          {label}{' '}
          {required ? <span className="text-bold text-red-600">*</span> : ''}
        </Label>
      ) : null}

      <div
        className={cx([
          'flex rounded-project-input overflow-hidden',
          label ? 'mt-1' : '',
          wrapperClassName,
        ])}
      >
        {prefix}
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
            readOnly,
          })}
          type={type}
          id={idOverride ?? id}
          disabled={disabled ?? false}
          required={required}
          readOnly={readOnly}
          {...rest}
        />
        {suffix ? suffix : null}
      </div>

      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      {description && (
        <p className="mt-3 text-sm text-cyan-100">{description}</p>
      )}
    </div>
  );
});
