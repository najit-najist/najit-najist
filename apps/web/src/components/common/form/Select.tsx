'use client';

import { Listbox, Transition } from '@headlessui/react';
import {
  CheckIcon,
  ChevronUpDownIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';
import { cva, cx } from 'class-variance-authority';
import { Fragment, ReactElement, ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

import { ErrorMessage } from './ErrorMessage';
import { labelStyles } from './Label';

const selectButtonStyles = cva(
  'relative w-full cursor-default rounded-project-input bg-white disabled:bg-gray-100 text-left ring-1 ring-inset focus:outline-none focus:ring-2',
  {
    variants: {
      size: {
        normal: 'py-[0.55rem] pl-3 pr-10 sm:text-sm sm:leading-6',
      },
      color: {
        default: 'focus:ring-project-primary text-gray-900 ring-gray-300',
      },
    },
    defaultVariants: {
      size: 'normal',
      color: 'default',
    },
  },
);

export type ItemBase = { id: string | number };

export type SelectProps<T extends ItemBase> = {
  label?: string;
  selected?: T | null;
  items: T[];
  onChange?: (nextValue: T | null) => void;
  formatter: (item: T) => ReactNode;
  name?: string;
  disabled?: boolean;
  multiple?: boolean;
  error?: string | FieldError;
  className?: string;
  onAddNewItem?: () => void;
  addNewItemLabel?: string;
  fallbackButtonContents?: ReactNode;
  defaultValue?: T | null | undefined;
};

export function Select<T extends ItemBase>({
  label,
  selected,
  onChange,
  formatter,
  items,
  name,
  disabled,
  multiple,
  error,
  className,
  onAddNewItem,
  addNewItemLabel = 'Přidat nový',
  fallbackButtonContents = 'Vyberte',
  defaultValue,
}: SelectProps<T>): ReactElement {
  return (
    <Listbox
      value={selected}
      onChange={onChange}
      multiple={multiple}
      disabled={disabled}
      name={name}
      as="div"
      className={className}
      defaultValue={defaultValue}
    >
      {({ open, value }) => (
        <>
          {label ? (
            <Listbox.Label className={labelStyles()}>{label}</Listbox.Label>
          ) : null}
          <div className={cx('relative', label ? 'mt-1' : '')}>
            <Listbox.Button
              aria-disabled={disabled}
              className={selectButtonStyles()}
            >
              <span className="block truncate">
                {(multiple && Array.isArray(value) ? value?.length : value)
                  ? Array.isArray(value)
                    ? value.map(formatter).join(', ')
                    : (formatter(value!) ?? '')
                  : fallbackButtonContents}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-project-input bg-white p-1 text-base shadow-lg ring-1 ring-gray-400 ring-opacity-5 focus:outline-none sm:text-sm">
                {items.map((item) => (
                  <Listbox.Option
                    key={item.id}
                    className={({ active }) =>
                      cx(
                        active
                          ? 'bg-project-primary text-white'
                          : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9 rounded-xl duration-100',
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={cx(
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate',
                          )}
                        >
                          {formatter(item)}
                        </span>

                        {selected ? (
                          <span
                            className={cx(
                              active ? 'text-white' : 'text-ocean-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4',
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
                {onAddNewItem ? (
                  <Listbox.Option
                    className={
                      'relative select-none py-2 pl-3 pr-9 hover:bg-project-secondary hover:text-white text-project-secondary rounded-project-input w-full text-left group border-t-2 cursor-pointer'
                    }
                    onClick={onAddNewItem}
                    value={selected}
                  >
                    <span className="block truncate font-normal">
                      {addNewItemLabel}
                    </span>

                    <span
                      className={cx(
                        'absolute inset-y-0 right-0 flex items-center pr-4 text-project-secondary group-hover:text-white',
                      )}
                    >
                      <PlusIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </Listbox.Option>
                ) : null}
              </Listbox.Options>
            </Transition>
          </div>
          {error ? (
            <ErrorMessage>
              {typeof error === 'string' ? error : error.message}
            </ErrorMessage>
          ) : null}
        </>
      )}
    </Listbox>
  );
}
