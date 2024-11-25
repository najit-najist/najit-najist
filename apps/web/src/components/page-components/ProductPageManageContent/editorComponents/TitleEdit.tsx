'use client';

import { Input } from '@components/common/form/Input';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { ProductFormData } from '../_types';

export const TitleEdit: FC = () => {
  const { register, formState } = useFormContext<ProductFormData>();

  return (
    <Input
      size="lg"
      className="!text-4xl font-title"
      disabled={formState.isSubmitting}
      placeholder="Název produktu"
      error={formState.errors.name}
      {...register('name')}
    />
  );
};
