'use client';

import { Input } from '@components/common/form/Input';
import { DATETIME_LOCAL_INPUT_FORMAT } from '@constants';
import { dayjs } from '@dayjs';
import { ChangeEventHandler, FC } from 'react';
import { Controller } from 'react-hook-form';

export const PublishedAtEdit: FC = () => {
  return (
    <Controller
      name="publishedAt"
      render={({ field, fieldState, formState }) => {
        return (
          <Input
            ref={field.ref}
            label="Datum publikace"
            size="normal"
            disabled={formState.isSubmitting || !field.value}
            rootClassName="max-w-[200px] text-sm mb-3"
            type={!field.value ? 'text' : 'datetime-local'}
            name={field.name}
            error={fieldState.error}
            placeholder={!field.value ? 'Nepublikováno' : undefined}
            value={
              !field.value
                ? ''
                : dayjs.tz(field.value).format(DATETIME_LOCAL_INPUT_FORMAT)
            }
            onBlur={field.onBlur}
            onChange={
              ((event) => {
                const value = event.target.valueAsDate ?? event.target.value;

                field.onChange(dayjs.tz(value).toDate());
              }) satisfies ChangeEventHandler<HTMLInputElement>
            }
          />
        );
      }}
    />
  );
};
