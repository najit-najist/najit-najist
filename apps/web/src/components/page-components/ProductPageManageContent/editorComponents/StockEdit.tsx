'use client';

import { ProductStock } from '@najit-najist/api';
import {
  Checkbox,
  CheckboxProps,
  CheckboxWrapper,
  Input,
  inputPrefixSuffixStyles,
} from '@najit-najist/ui';
import { FC, useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { ProductFormData } from '../_types';

const defaultStock: Pick<ProductStock, 'count'> = {
  count: 0,
};

export const StockEdit: FC = () => {
  const { register, formState } = useFormContext<ProductFormData>();
  const enableStockValue = useRef<Pick<ProductStock, 'count'> | undefined>(
    defaultStock
  );
  const stockInput = useController({
    name: 'stock',
  });

  const stockEnabled = !!stockInput.field.value;
  const onStockToggle: CheckboxProps['onChange'] = (event) => {
    const nextValue = event.target.checked;
    const currentStockValue = { ...(stockInput.field.value ?? defaultStock) };

    stockInput.field.onChange(nextValue ? enableStockValue.current : null);
    enableStockValue.current = currentStockValue ?? defaultStock;
  };

  return (
    <>
      <CheckboxWrapper
        childId="product-stock-enabled"
        title="U produktu vedeme sklad"
        className="font-title !text-base"
      >
        <Checkbox
          id="product-stock-enabled"
          checked={stockEnabled}
          onChange={onStockToggle}
          size="md"
        />
      </CheckboxWrapper>

      <hr className="h-0.5 bg-gray-100 border-none mt-4 mb-5" />

      <Input
        label="Počet produktů na skladě"
        type="number"
        placeholder="Sklad"
        // TODO: is it possible to get this value from schema somehow?
        min={0}
        suffix={
          <div className={inputPrefixSuffixStyles({ type: 'suffix' })}>
            <span className="flex items-center justify-center px-3 h-full">
              Ks
            </span>
          </div>
        }
        error={formState.errors.price?.value}
        disabled={!stockEnabled}
        {...register('stock.count', { valueAsNumber: true })}
      />
    </>
  );
};
