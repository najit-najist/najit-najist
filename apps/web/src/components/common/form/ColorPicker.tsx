'use client';

import { FC, useMemo, ComponentProps, useCallback } from 'react';
import {
  ColorPicker as BaseColorPicker,
  ColorService,
} from 'react-color-palette';
import { Controller, useController } from 'react-hook-form';

import {
  FormControlWrapper,
  FormControlWrapperBaseProps,
} from './FormControlWrapper';

export type ColorPickerProps = Omit<
  FormControlWrapperBaseProps,
  'id' | 'type'
> & {
  name: string;
  className?: string;
  wrapperClassName?: string;
};

type PickerProps = ComponentProps<typeof BaseColorPicker>;

export const ColorPicker: FC<ColorPickerProps> = ({
  title,
  description,
  error,
  required,
  name,
  wrapperClassName,
}) => {
  const { field } = useController({
    name,
  });

  const value = useMemo(
    () => ColorService.convert('hex', field.value ?? '#121212'),
    [field.value],
  );
  const onChange = useCallback<PickerProps['onChange']>(
    (nextColor) => field.onChange(nextColor.hex),
    [],
  );

  return (
    <FormControlWrapper
      title={title}
      description={description}
      error={error}
      required={required}
      className={wrapperClassName}
    >
      <div className="z-10 mt-3 w-full bg-white rounded-project">
        <BaseColorPicker
          hideAlpha
          hideInput
          height={200}
          color={value}
          onChange={onChange}
        />
      </div>
    </FormControlWrapper>
  );
};
