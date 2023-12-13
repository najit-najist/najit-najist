import { Column, Row } from '@react-email/components';
import clsx from 'clsx';
import { FC } from 'react';

export type SpacingSize = 'md' | 'lg' | 'normal' | 'sm' | 'xs';

const spacingSizeToHeight: Record<SpacingSize, string> = {
  lg: clsx('h-8'),
  md: clsx('h-5'),
  normal: clsx('h-1 sm:h-3'),
  sm: clsx('h-1 sm:h-2'),
  xs: clsx('h-1'),
};

export const Spacing: FC<{ size?: SpacingSize }> = ({ size = 'normal' }) => (
  <Row>
    <Column className={spacingSizeToHeight[size]} />
  </Row>
);
