'use client';

import { Checkbox, CheckboxProps } from '@components/common/form/Checkbox';
import { CheckboxWrapper } from '@components/common/form/CheckboxWrapper';
import { Input, inputPrefixSuffixStyles } from '@components/common/form/Input';
import { ProductStock } from '@najit-najist/database/models';
import { FC, useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { ProductFormData } from '../_types';

const defaultStock: Pick<ProductStock, 'value'> = {
  value: 0,
};

export const StockEdit: FC = () => {
  const { register, formState } = useFormContext<ProductFormData>();
  const enableStockValue = useRef<Pick<ProductStock, 'value'> | undefined>(
    defaultStock,
  );
  const stockInput = useController({
    name: 'stock',
  });

  const fieldValue = stockInput.field.value as ProductStock | null | undefined;
  const stockEnabled = typeof fieldValue?.value === 'number';
  const onStockToggle: CheckboxProps['onChange'] = (event) => {
    const nextValue = event.target.checked;
    const currentStockValue = { ...(fieldValue ?? defaultStock) };

    stockInput.field.onChange(nextValue ? enableStockValue.current : null);
    enableStockValue.current = currentStockValue ?? defaultStock;
  };

  return (
    <>
      <CheckboxWrapper
        childId="product-stock-enabled"
        title="U produktu vedeme sklad"
        className="!text-sm"
      >
        <Checkbox
          id="product-stock-enabled"
          checked={stockEnabled}
          onChange={onStockToggle}
          size="normal"
        />
      </CheckboxWrapper>
      {stockEnabled ? (
        <>
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
            error={formState.errors.stock?.value}
            disabled={!stockEnabled}
            rootClassName="mt-2"
            {...register('stock.value', {
              valueAsNumber: true,
              shouldUnregister: true,
            })}
          />
        </>
      ) : null}
    </>
  );
};
