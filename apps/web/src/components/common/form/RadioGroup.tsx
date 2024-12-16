'use client';

import {
  RadioGroup as HeadlessRadioGroup,
  RadioGroupProps as HeadlessRadioGroupProps,
} from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { cva, cx } from 'class-variance-authority';
import { ReactNode } from 'react';

export enum RadioGroupVariants {
  Buttons,
  Radios,
}

export type RadioGroupItem = {
  id: string | number;
  name: string;
  description?: ReactNode;
  disabled?: boolean;
};

export type RadioGroupProps<ItemType extends RadioGroupItem> =
  HeadlessRadioGroupProps<'div', ItemType> & {
    label?: string;
    items: RadioGroupItem[];
    itemsWrapperClassName?: string;
    itemWrapperClassName?: string;
    variant?: RadioGroupVariants;
    valueAs?: 'key' | 'object';
    keyName?: keyof ItemType;
  };

export const radioRootStyles = cva('', {
  variants: {
    variant: {
      [RadioGroupVariants.Buttons]:
        'relative flex rounded-project-input px-5 py-4 shadow-md focus:outline-none w-full',
      [RadioGroupVariants.Radios]: 'p-1 cursor-pointer',
    } satisfies Record<RadioGroupVariants, string>,
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: '!cursor-pointer',
    },
    active: {
      true: 'ring-2 ring-white/60 ring-offset-2 ring-project-accent',
      false: '',
    },
    checked: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: RadioGroupVariants.Buttons,
      checked: true,
      className: 'bg-project-primary text-white',
    },
    {
      variant: RadioGroupVariants.Buttons,
      checked: false,
      className: 'bg-white',
    },
  ],
});

export function RadioGroup<ItemType extends RadioGroupItem>({
  value,
  onChange,
  label,
  items,
  itemsWrapperClassName,
  itemWrapperClassName,
  disabled,
  variant = RadioGroupVariants.Buttons,
  valueAs = 'object',
  keyName,
  ...rest
}: RadioGroupProps<ItemType>) {
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
            value={valueAs === 'object' ? item : (item as any)[keyName!]}
            disabled={disabled || item.disabled}
            className={({ active, checked }) =>
              radioRootStyles({
                active,
                disabled: disabled || item.disabled,
                checked,
                variant,
                className: itemWrapperClassName,
              })
            }
          >
            {({ active, checked }) => (
              <>
                <div
                  className={cx(
                    'flex w-full items-start',
                    variant === RadioGroupVariants.Radios && '',
                    variant === RadioGroupVariants.Buttons && 'justify-between',
                  )}
                >
                  {variant === RadioGroupVariants.Radios ? (
                    <div className="duration-200 flex-none mr-2 bg-white -bottom-[1px] relative h-4 w-4 flex rounded-full border-project shadow-md">
                      <div
                        className={cx(
                          'h-2 w-2 rounded-full top-1 left-1 bg-project-primary m-auto duration-200',
                          checked ? 'opacity-100' : 'opacity-0',
                          active ? '!bg-gray-200 opacity-100' : '',
                        )}
                      />
                    </div>
                  ) : null}
                  <div className="flex items-center">
                    <div className="text-sm">
                      <HeadlessRadioGroup.Label
                        as="p"
                        className={cx(
                          'font-medium',
                          checked && variant === RadioGroupVariants.Buttons
                            ? 'text-white'
                            : 'text-gray-900',
                        )}
                      >
                        {item.name}
                      </HeadlessRadioGroup.Label>
                      {item.description ? (
                        <HeadlessRadioGroup.Description
                          as="span"
                          className={`mt-1 block ${
                            checked ? 'text-sky-100' : 'text-gray-500'
                          }`}
                        >
                          {item.description}
                        </HeadlessRadioGroup.Description>
                      ) : null}
                    </div>
                  </div>
                  {variant === RadioGroupVariants.Buttons ? (
                    <div
                      className={cx(
                        'shrink-0 text-white duration-200',
                        checked ? '' : 'opacity-0',
                      )}
                    >
                      <CheckIcon className="h-6 w-6" />
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </HeadlessRadioGroup.Option>
        ))}
      </div>
    </HeadlessRadioGroup>
  );
}
