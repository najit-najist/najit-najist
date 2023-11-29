import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { cva, cx, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  VariantProps<typeof buttonStyles> & { contentWrapperClassName?: string };

export const buttonStyles = cva(
  'duration-100 focus:outline-none hover:shadow-sm disabled:shadow-none disabled:cursor-not-allowed whitespace-nowrap',
  {
    variants: {
      color: {
        noColor: '',
        primary:
          'bg-project-primary focus:ring-project-primary text-white disabled:bg-opacity-50',
        secondary:
          'bg-project-secondary focus:ring-project-secondary text-white disabled:bg-opacity-50',
        /**
         * @deprecated
         */
        normal:
          'bg-project-primary focus:ring-project-primary text-white disabled:bg-opacity-50',
        white:
          'bg-white text-deep-green-400 shadow font-semibold disabled:bg-gray-50',
        sweet:
          'bg-green-300 hover:bg-green-400 focus:ring-bg-green-400 text-white',
        blue: 'bg-blue-400 hover:bg-blue-500 text-white border border-blue-600',
        red: 'bg-red-700 hover:bg-red-600 text-white border border-red-700',
        softRed:
          'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200',
        subtleRed: 'hover:bg-red-50 text-red-600 border-0',
      },
      appearance: {
        small: 'py-2 px-4 text-sm',
        spaceless: '',
        normal: 'py-2 px-8',
      },
      asLink: {
        true: 'hover:underline',
        false: '',
      },
      isLoading: {
        true: 'cursor-wait opacity-70',
        false: '',
      },
      notRounded: {
        true: '',
        false: 'rounded-md',
      },
      notAnimated: {
        true: '',
        false: 'hover:scale-105 active:scale-95',
      },
      withoutRing: {
        true: '',
        false: 'focus:ring-2 focus:ring-offset-2 ',
      },
    },
    defaultVariants: {
      appearance: 'normal',
      color: 'normal',
      isLoading: false,
      notRounded: false,
      notAnimated: false,
      withoutRing: false,
    },
    compoundVariants: [
      {
        color: 'noColor',
      },
    ],
  }
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className,
      isLoading,
      notRounded,
      withoutRing,
      color,
      contentWrapperClassName,
      ...rest
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={buttonStyles({
          className,
          isLoading,
          notRounded,
          color,
          withoutRing,
          ...rest,
        })}
        type="button"
        {...rest}
      >
        {isLoading ? (
          <ArrowPathIcon className="animate-spin w-4 h-4 inline-block mr-2" />
        ) : null}
        <div className={cx('inline-block', contentWrapperClassName)}>
          {children}
        </div>
      </button>
    );
  }
);
