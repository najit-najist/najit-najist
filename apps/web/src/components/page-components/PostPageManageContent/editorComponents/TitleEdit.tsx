'use client';

import { Input } from '@najit-najist/ui';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

export const TitleEdit: FC = () => {
  const { register, formState } = useFormContext();

  return (
    <Input
      size="lg"
      className="!text-4xl font-suez"
      disabled={formState.isSubmitting}
      placeholder="Titulek článku..."
      {...register('title')}
    />
  );
};
