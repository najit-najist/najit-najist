'use client';

import { Input, inputPrefixSuffixStyles } from '@najit-najist/ui';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { ProductFormData } from '../_types';

export const StockEdit: FC = () => {
  const { register, formState } = useFormContext<ProductFormData>();

  return (
    <div className="max-w-xs mt-5">
      <Input
        size="lg"
        label="Počet produktů na skladě"
        type="number"
        placeholder="Sklad"
        // TODO: is it possible to get this value from schema somehow?
        min={0}
        suffix={
          <div className={inputPrefixSuffixStyles({ type: 'suffix' })}>
            <span className="flex items-center justify-center px-4 h-full text-lg">
              Ks
            </span>
          </div>
        }
        error={formState.errors.price?.value}
        {...register('stock.count', { valueAsNumber: true })}
      />
    </div>
  );
};
