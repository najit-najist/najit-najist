'use client';

import {
  RadioGroup as HeadlessRadioGroup,
  RadioGroupProps as HeadlessRadioGroupProps,
} from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { cx } from 'class-variance-authority';
import { ReactNode } from 'react';

export type RadioGroupItem = {
  id: string;
  name: string;
  description: ReactNode;
};

export type RadioGroupProps<ItemType extends RadioGroupItem> =
  HeadlessRadioGroupProps<'div', ItemType> & {
    label?: string;
    items: RadioGroupItem[];
    itemsWrapperClassName?: string;
    itemWrapperClassName?: string;
  };

export function RadioGroup<ItemType extends RadioGroupItem>({
  value,
  onChange,
  label,
  items,
  itemsWrapperClassName,
  itemWrapperClassName,
  disabled,
  ...rest
}: RadioGroupProps<RadioGroupItem>) {
  return (
    <HeadlessRadioGroup
      as="div"
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...rest}
    >
      {label ? (
        <HeadlessRadioGroup.Label className="sr-only">
          {label}
        </HeadlessRadioGroup.Label>
      ) : null}
      <div className={cx('space-y-2 sm:space-y-0', itemsWrapperClassName)}>
        {items.map((item) => (
          <HeadlessRadioGroup.Option
            key={item.name}
            value={item}
            className={({ active, checked }) =>
              `${
                active
                  ? 'ring-2 ring-white/60 ring-offset-2 ring-project-accent'
                  : ''
              }
              ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
              ${checked ? 'bg-project-primary/75 text-white' : 'bg-white'}
              ${itemWrapperClassName}
                relative flex rounded-lg px-5 py-4 shadow-md focus:outline-none w-full`
            }
          >
            {({ active, checked }) => (
              <>
                <div className="flex w-full items-start justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <HeadlessRadioGroup.Label
                        as="p"
                        className={`font-medium  ${
                          checked ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {item.name}
                      </HeadlessRadioGroup.Label>
                      <HeadlessRadioGroup.Description
                        as="span"
                        className={`mt-1 block ${
                          checked ? 'text-sky-100' : 'text-gray-500'
                        }`}
                      >
                        {item.description}
                      </HeadlessRadioGroup.Description>
                    </div>
                  </div>
                  <div
                    className={cx(
                      'shrink-0 text-white duration-200',
                      checked ? '' : 'opacity-0'
                    )}
                  >
                    <CheckIcon className="h-6 w-6" />
                  </div>
                </div>
              </>
            )}
          </HeadlessRadioGroup.Option>
        ))}
      </div>
    </HeadlessRadioGroup>
  );
}
