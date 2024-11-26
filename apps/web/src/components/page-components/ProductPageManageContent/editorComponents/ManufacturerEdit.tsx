'use client';

import { Input } from '@components/common/form/Input';
import { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { ProductFormData } from '../_types';

export const ManufacturerEdit = (): ReactElement => {
  const { register, formState } = useFormContext<ProductFormData>();

  return (
    <div className="max-w-md">
      <Input
        size="lg"
        label="Výrobce"
        placeholder="Výrobce"
        error={formState.errors.manufacturer}
        disabled={formState.isSubmitting}
        {...register('manufacturer')}
      />
    </div>
  );
};
