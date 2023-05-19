'use client';

import { Post } from '@najit-najist/api';
import { Input } from '@najit-najist/ui';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

export const PublishedAtEdit: FC = () => {
  const { register, formState } = useFormContext<Post>();

  return (
    <Input
      label="Datum a čas vytvoření"
      size="normal"
      disabled={formState.isSubmitting}
      rootClassName="max-w-[200px] text-sm mb-3"
      type="datetime-local"
      {...register('publishedAt', { valueAsDate: true })}
    />
  );
};
