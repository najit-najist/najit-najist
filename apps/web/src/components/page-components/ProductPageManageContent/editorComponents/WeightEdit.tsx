'use client';

import { Input, inputPrefixSuffixStyles } from '@najit-najist/ui';
import { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';

import { ProductFormData } from '../_types';

export const WeightEdit = (): ReactElement => {
  const { register, formState } = useFormContext<ProductFormData>();

  return (
    <div className="max-w-md">
      <Input
        size="lg"
        label="Váha"
        type="number"
        placeholder="Váha produktu v gramech"
        // TODO: is it possible to get this value from schema somehow?
        min={0}
        suffix={
          <div className={inputPrefixSuffixStyles({ type: 'suffix' })}>
            <span className="flex items-center justify-center px-4 h-full text-lg whitespace-nowrap">
              g
            </span>
          </div>
        }
        error={formState.errors.price?.value}
        disabled={formState.isSubmitting}
        {...register('weight', { valueAsNumber: true })}
      />
    </div>
  );
};
