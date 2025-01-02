import { Text as TextBase, TextProps } from '@react-email/components';
import clsx from 'clsx';
import { FC } from 'react';

export type Props = TextProps & {
  size?: 'normal' | 'small' | 'medium';
  color?: 'normal' | 'subtle' | 'warning';
  spacing?: boolean;
};

const sizeToClassName: Record<NonNullable<Props['size']>, string> = {
  normal: 'text-md',
  small: 'text-xs',
  medium: 'text-lg',
};

const colorToClassName: Record<NonNullable<Props['color']>, string> = {
  normal: 'text-slate-700',
  subtle: 'text-slate-400',
  warning: 'text-orange-500',
};

export const Text: FC<Props> = ({
  className,
  size = 'normal',
  color = 'normal',
  spacing = true,
  ...props
}) => (
  <TextBase
    className={clsx(
      'leading-6',
      spacing ? 'my-5' : '',
      sizeToClassName[size],
      colorToClassName[color],
      className,
    )}
    {...props}
  />
);
