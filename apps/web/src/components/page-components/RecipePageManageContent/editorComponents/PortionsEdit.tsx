'use client';

import { CreateRecipeInput } from '@najit-najist/api';
import { Input } from '@najit-najist/ui';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

export const PortionsEdit: FC = () => {
  const { register, formState } = useFormContext<CreateRecipeInput>();

  return (
    <>
      <Input
        type="number"
        min={1}
        label="Počet porcí"
        error={formState.errors.numberOfPortions}
        rootClassName="-mt-5 mb-2"
        {...register('numberOfPortions', { valueAsNumber: true })}
      />
    </>
  );
};
