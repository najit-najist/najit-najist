'use client';

import { Post } from '@najit-najist/database/models';
import { Input } from '@najit-najist/ui';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

export const TitleEdit: FC = () => {
  const { register, formState } = useFormContext<Post>();

  return (
    <Input
      size="lg"
      className="!text-4xl font-title"
      disabled={formState.isSubmitting}
      placeholder="Titulek článku..."
      error={formState.errors.title}
      {...register('title')}
    />
  );
};
