'use client';

import { Input } from '@components/common/form/Input';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { RecipeFormData } from '../_types';

export const TitleEdit: FC = () => {
  const { register, formState } = useFormContext<RecipeFormData>();

  return (
    <Input
      size="lg"
      className="!text-4xl font-title text-project-primary overflow-hidden"
      disabled={formState.isSubmitting}
      placeholder="Název receptu"
      error={formState.errors.title}
      {...register('title')}
    />
  );
};
