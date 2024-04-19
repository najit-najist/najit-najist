'use client';

import { Input, inputPrefixSuffixStyles } from '@najit-najist/ui';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { ProductFormData } from '../_types';

export const PriceEditor: FC = () => {
  const { register, formState } = useFormContext<ProductFormData>();

  return (
    <div className="max-w-xs">
      <Input
        size="lg"
        label="Cena"
        type="number"
        placeholder="Cena produktu"
        // TODO: is it possible to get this value from schema somehow?
        min={0}
        suffix={
          <div className={inputPrefixSuffixStyles({ type: 'suffix' })}>
            <span className="flex items-center justify-center px-4 h-full text-lg whitespace-nowrap">
              Kč / Ks
            </span>
          </div>
        }
        error={formState.errors.price?.value}
        disabled={formState.isSubmitting}
        {...register('price.value', { valueAsNumber: true })}
      />
    </div>
  );
};
