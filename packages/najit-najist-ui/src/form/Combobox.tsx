import { ChangeEvent, FC } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Combobox as ComboboxDefault } from '@headlessui/react';
import { cx } from 'class-variance-authority';
import { Label } from './Label';
import { inputStyles } from './Input';
import type { FieldError } from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';

type Item = { id: string; [x: string]: any };

export type ComboboxProps<I extends Item = Item> = {
  isLoading?: boolean;
  label?: string;
  error?: FieldError;
  items: I[];
  required?: boolean;
  placeholder?: string;

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
}: ComboboxProps<I>): ReturnType<FC<ComboboxProps<I>>> {
  return (
    <ComboboxDefault
      as="div"
      value={selectedValue}
      onChange={onSelectedValueChange}
    >
      {label ? (
        <ComboboxDefault.Label as={Label}>
          {label}{' '}
          {required ? <span className="text-bold text-red-600">*</span> : ''}
        </ComboboxDefault.Label>
      ) : null}
      <div className="relative mt-1">
        <ComboboxDefault.Input
          placeholder={placeholder}
          className={inputStyles()}
          onChange={onInputValueChange}
          displayValue={displayValue}
        />
        <ComboboxDefault.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </ComboboxDefault.Button>

        {!!isLoading === false ? (
          <ComboboxDefault.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {items.length ? (
              <>
                {items.map((item) => (
                  <ComboboxDefault.Option
                    key={item.id}
                    value={item}
                    className={({ active }) =>
                      cx(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        active
                          ? 'bg-deep-green-300 text-white'
                          : 'text-gray-900'
                      )
                    }
                  >
                    {({ active, selected }) => (
                      <>
                        <span
                          className={cx(
                            'block truncate',
                            selected ? 'font-semibold' : ''
                          )}
                        >
                          {itemLabelFormatter(item)}
                        </span>

                        {selected ? (
                          <span
                            className={cx(
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                              active ? 'text-white' : 'text-indigo-600'
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
