import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { cx, VariantProps } from 'class-variance-authority';
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  ReactElement,
} from 'react';

import { buttonStyles } from './buttonStyles.js';

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  VariantProps<typeof buttonStyles> & {
    contentWrapperClassName?: string;
    icon?: ReactElement;
  };

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
      padding,
      icon: IconComponent,
      notAnimated,
      disabled,
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
          padding,
          notAnimated: notAnimated || isLoading || disabled,
          ...rest,
        })}
        type="button"
        disabled={isLoading || disabled}
        {...rest}
      >
        {isLoading ? (
          <ArrowPathIcon
            className={cx(
              'animate-spin w-4 h-4 inline-block',
              children ? 'mr-2' : ''
            )}
          />
        ) : (
          IconComponent ?? null
        )}
        {children ? (
          <div className={cx('inline-block', contentWrapperClassName)}>
            {children}
          </div>
        ) : null}
      </button>
    );
  }
);
