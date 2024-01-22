'use client';

import { FC } from 'react';
import { ColorPicker as BaseColorPicker } from 'react-color-palette';
import { Controller } from 'react-hook-form';

import {
  FormControlWrapper,
  FormControlWrapperBaseProps,
} from './FormControlWrapper.js';

export type ColorPickerProps = Omit<
  FormControlWrapperBaseProps,
  'id' | 'type'
> & {
  name: string;
  className?: string;
  wrapperClassName?: string;
};

export const ColorPicker: FC<ColorPickerProps> = ({
  title,
  description,
  error,
  required,
  name,
  wrapperClassName,
}) => {
  return (
    <Controller
      name={name}
      render={({ field }) => (
        <FormControlWrapper
          title={title}
          description={description}
          error={error}
          required={required}
          className={wrapperClassName}
        >
          <div className="z-10 mt-3 w-full bg-white rounded-md">
            <BaseColorPicker
              height={200}
              color={field.value ?? '#121212'}
              onChange={(nextValue) => {
                field.onChange(nextValue.hex);
              }}
            />
          </div>
        </FormControlWrapper>
      )}
    />
  );
};
