'use client';

import { Input } from '@components/common/form/Input';
import { Recipe } from '@najit-najist/database/models';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

export const PortionsEdit: FC = () => {
  const { register, formState } = useFormContext<Recipe>();

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
