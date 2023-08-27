'use client';

import { DATETIME_LOCAL_INPUT_FORMAT } from '@constants';
import { Input } from '@najit-najist/ui';
import dayjs from 'dayjs';
import { FC } from 'react';
import { Controller } from 'react-hook-form';

export const PublishedAtEdit: FC = () => {
  return (
    <Controller
      name="publishedAt"
      render={({ field, fieldState, formState }) => (
        <Input
          ref={field.ref}
          label="Datum a čas vytvoření"
          size="normal"
          disabled={formState.isSubmitting}
          rootClassName="max-w-[200px] text-sm mb-3"
          type="datetime-local"
          name={field.name}
          error={fieldState.error}
          value={dayjs(field.value).format(DATETIME_LOCAL_INPUT_FORMAT)}
          onBlur={field.onBlur}
          onChange={(event) => {
            const value = event.target.valueAsDate ?? event.target.value;

            field.onChange(dayjs(value).toDate());
          }}
        />
      )}
    />
  );
};
