'use client';

import { Combobox as ComboboxDefault } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { cx } from 'class-variance-authority';
import { ChangeEvent, FC } from 'react';
import type { FieldError } from 'react-hook-form';

import { ErrorMessage } from './ErrorMessage';
import { InputVariantProps, inputStyles } from './Input';
import { Label } from './Label';

type Item = { id: string | number; [x: string]: any };

export type ComboboxProps<I extends Item = Item> = Pick<
  InputVariantProps,
  'size' | 'disabled'
> & {
  isLoading?: boolean;
  label?: string;
  error?: FieldError;
  items: I[];
  required?: boolean;
  placeholder?: string;
  className?: string;
  nullable?: false;

  itemLabelFormatter: (item: I) => string;

  displayValue: (currentItem: I) => string;
  onInputValueChange: (value: ChangeEvent<HTMLInputElement>) => void;
  selectedValue?: I;
  onSelectedValueChange: (value: I) => void;
};

export function Combobox<I extends Item>({
  displayValue,
  onInputValueChange,
  selectedValue,
  onSelectedValueChange,
  isLoading,
  items,
  label,
  itemLabelFormatter,
  error,
  required,
  placeholder,
  className,
  size,
  disabled,
}: ComboboxProps<I>): ReturnType<FC<ComboboxProps<I>>> {
  return (
    <ComboboxDefault
      as="div"
      value={selectedValue}
      onChange={onSelectedValueChange}
      className={className}
      disabled={disabled ?? false}
    >
      {label ? (
        <ComboboxDefault.Label className="mb-1" as={Label}>
          {label}{' '}
          {required ? <span className="text-bold text-red-600">*</span> : ''}
        </ComboboxDefault.Label>
      ) : null}
      <div className="relative">
        <ComboboxDefault.Input
          placeholder={placeholder}
          className={inputStyles({ size, disabled })}
          onChange={onInputValueChange}
          displayValue={displayValue}
        />
        <ComboboxDefault.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-project-input px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxDefault.Button>

        {!!isLoading === false ? (
          <ComboboxDefault.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-project bg-white p-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {items.length ? (
              <>
                {items.map((item) => (
                  <ComboboxDefault.Option
                    key={item.id}
                    value={item}
                    className={({ active }) =>
                      cx(
                        'relative cursor-default select-none py-2 pl-3 pr-9 rounded-project-input',
                        active
                          ? 'bg-project-primary text-white'
                          : 'text-gray-900 focus:bg-project-primary/30 text-project-primary',
                      )
                    }
                  >
                    {({ active, selected }) => (
                      <>
                        <span
                          className={cx(
                            'block truncate',
                            selected ? 'font-semibold' : '',
                          )}
                        >
                          {itemLabelFormatter(item)}
                        </span>

                        {selected ? (
                          <span
                            className={cx(
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                              active ? 'text-white' : 'text-indigo-600',
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ComboboxDefault.Option>
                ))}
              </>
            ) : (
              <p className="px-3 py-2">Žádné výsledky...</p>
            )}
          </ComboboxDefault.Options>
        ) : null}
      </div>
      {error ? <ErrorMessage>{error.message}</ErrorMessage> : null}
    </ComboboxDefault>
  );
}
