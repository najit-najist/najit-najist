import { Text as TextBase, TextProps } from '@react-email/text';
import clsx from 'clsx';
import { FC } from 'react';

export type Props = TextProps & {
  size?: 'normal' | 'small';
  color?: 'normal' | 'subtle';
  spacing?: boolean;
};

const sizeToClassName: Record<NonNullable<Props['size']>, string> = {
  normal: 'text-md',
  small: 'text-xs',
};

const colorToClassName: Record<NonNullable<Props['color']>, string> = {
  normal: 'text-slate-800',
  subtle: 'text-slate-400',
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
      className
    )}
    {...props}
  />
);
