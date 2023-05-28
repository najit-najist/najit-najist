import { Fragment, ReactElement } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { cva, cx } from 'class-variance-authority';
import { labelStyles } from './Label';
import { ErrorMessage } from './ErrorMessage';
import { FieldError } from 'react-hook-form';

const selectButtonStyles = cva(
  'relative w-full cursor-default rounded-md bg-white text-left shadow-sm ring-1 ring-inset focus:outline-none focus:ring-2',
  {
    variants: {
      size: {
        normal: 'py-[0.55rem] pl-3 pr-10 sm:text-sm sm:leading-6',
      },
      color: {
        default: 'focus:ring-deep-green-400 text-gray-900 ring-gray-300',
      },
    },
    defaultVariants: {
      size: 'normal',
      color: 'default',
    },
  }
);

export type ItemBase = { id: string };

export type SelectProps<T extends ItemBase> = {
  label?: string;
  selected?: T;
  items: T[];
  onChange?: (nextValue: T) => void;
  formatter: (item: T) => string;
  name?: string;
  disabled?: boolean;
  multiple?: boolean;
  error?: string | FieldError;
  className?: string;
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
    >
      {({ open }) => (
        <>
          {label ? (
            <Listbox.Label className={labelStyles()}>{label}</Listbox.Label>
          ) : null}
          <div className="relative mt-1">
            <Listbox.Button className={selectButtonStyles()}>
              <span className="block truncate">
                {selected ? formatter(selected) ?? '' : 'Vyberte'}
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
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {items.map((item) => (
                  <Listbox.Option
                    key={item.id}
                    className={({ active }) =>
                      cx(
                        active ? 'bg-ocean-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={item}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={cx(
                            selected ? 'font-semibold' : 'font-normal',
                            'block truncate'
                          )}
                        >
                          {formatter(item)}
                        </span>

                        {selected ? (
                          <span
                            className={cx(
                              active ? 'text-white' : 'text-ocean-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
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
