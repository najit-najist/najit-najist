'use client';

import { ChangeEventHandler, ReactNode, useCallback, useMemo } from 'react';
import { FieldError } from 'react-hook-form';

import { Checkbox } from './Checkbox';
import { CheckboxWrapper } from './CheckboxWrapper';
import { ErrorMessage } from './ErrorMessage';
import { Label } from './Label';

export type ItemType = { id: string | 0 | number; [x: string]: any };

export type CheckboxGroupProps<T extends ItemType> = {
  name: string;
  label?: string;
  required?: boolean;
  titleField?: keyof T;
  options: T[];
  value?: T[] | null | undefined;
  error?: FieldError;
  description?: ReactNode;
  onChange: (callback: (prev: T[]) => T[]) => void;
  rootClassName?: string;
};

export function CheckboxGroup<T extends ItemType>({
  options,
  titleField = 'id',
  value,
  onChange,
  label,
  error,
  description,
  required,
  rootClassName,
}: CheckboxGroupProps<T>) {
  const itemIds = useMemo(() => value?.map((item) => item.id), [value]);
  const onItemCheckedChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const isChecked = event.target.checked;
      const morphedItem = options.find(
        (item) =>
          item.id === event.target.id || item.id === Number(event.target.id),
      );

      if (!morphedItem) {
        console.warn(
          'Could not find item in checkbox group hence not assigning it as selected',
        );

        return;
      }

      onChange((prev) => {
        if (morphedItem.id === 0) {
          if (isChecked) {
            return [];
          }

          return [];
        }

        if (isChecked) {
          return [...prev, morphedItem];
        }

        return [...prev].filter((item) => item.id !== morphedItem.id);
      });
    },
    [options, onChange],
  );

  return (
    <div className={rootClassName}>
      {label ? (
        <Label className="mb-1">
          {label}{' '}
          {required ? <span className="text-bold text-red-600">*</span> : ''}
        </Label>
      ) : null}

      {options.map((itemValue) => {
        const itemId = itemValue.id;

        return (
          <CheckboxWrapper
            key={itemValue.id}
            childId={String(itemId)}
            title={itemValue[titleField]}
          >
            <Checkbox
              id={String(itemId)}
              checked={
                itemIds?.includes(itemValue.id) ||
                (itemValue.id === 0 && !itemIds?.length)
              }
              onChange={onItemCheckedChange}
            />
          </CheckboxWrapper>
        );
      })}

      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      {description && (
        <p className="mt-3 text-sm text-cyan-100">{description}</p>
      )}
    </div>
  );
}
