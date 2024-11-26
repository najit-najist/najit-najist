'use client';

import {
  Switch as HeadlessSwitch,
  SwitchProps as HeadlessSwitchProps,
} from '@headlessui/react';
import { cx } from 'class-variance-authority';
import { FC } from 'react';

export type SwitchProps = Omit<HeadlessSwitchProps<'input'>, 'value'> & {
  description?: string;
  value: boolean;
};

export const Switch: FC<SwitchProps> = ({
  value,
  description,
  className,
  ...rest
}) => (
  <HeadlessSwitch
    checked={value}
    className={cx(
      value ? 'bg-green-300' : 'bg-gray-200',
      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2',
      className,
    )}
    {...rest}
  >
    <span className="sr-only">{description}</span>
    <span
      aria-hidden="true"
      className={cx(
        value ? 'translate-x-5' : 'translate-x-0',
        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
      )}
    />
  </HeadlessSwitch>
);
