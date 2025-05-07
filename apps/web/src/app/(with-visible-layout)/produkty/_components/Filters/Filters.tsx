'use client';

import { Input, inputPrefixSuffixStyles } from '@components/common/form/Input';
import {
  RadioGroup,
  RadioGroupVariants,
} from '@components/common/form/RadioGroup';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { ProductCategory } from '@najit-najist/database/models';
import { useRouter } from 'next/navigation';
import { FC,  useRef, useTransition } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { z } from 'zod';

import { ProductsPageSortBy } from '../../_types';
import { searchProductSchema } from '../../searchProductSchema';

const sortFieldItems = [
  {
    id: ProductsPageSortBy.RECOMMENDED,
    name: 'Doporučené',
  },
  {
    id: ProductsPageSortBy.PRICE_ASCENDING,
    name: 'Od Nejlevnějších',
  },
  {
    id: ProductsPageSortBy.PRICE_DESCENDING,
    name: 'Od Nejdražších',
  },
];

export const Filters: FC<{
  initialValues?: z.input<typeof searchProductSchema>;
  categories: ProductCategory[];
}> = ({ initialValues }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isRefreshing, startRefreshing] = useTransition();

  const [form, fields] = useForm({
    defaultValue: initialValues,
    onSubmit(event, { submission }) {
      event.preventDefault()

      if (submission?.status === 'success') {
        const queryParams = new URLSearchParams(window.location.search);

        const params = Object.entries({
          query: submission?.value?.query,
          sort:
            submission.value.sort !== ProductsPageSortBy.RECOMMENDED
              ? submission.value.sort
              : undefined,
        });

        for (const [key, value] of params) {
          if (!value) {
            queryParams.delete(key);
          } else {
            queryParams.set(key, value);
          }
        }

        startRefreshing(() => {
          // @ts-ignore
          router.push(`?${queryParams.toString()}`);
        });
      }
    },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: searchProductSchema }),
  });

  const debouncedSubmit = useDebounceCallback(() => {
    formRef.current?.requestSubmit();
  }, 300);

  return (
    <aside className="flex-none w-full mx-auto my-5 container">
      <form id={form.id} onSubmit={form.onSubmit} noValidate ref={formRef}>
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Vyhledávání..."
            rootClassName="w-full max-w-lg"
            name={fields.query.name}
            onChange={debouncedSubmit}
            defaultValue={fields.query.initialValue}
            suffix={
              <div className={inputPrefixSuffixStyles({ type: 'suffix' })}>
                {isRefreshing ? (
                  <ArrowPathIcon className="w-6 h-6 mx-3 sm:mx-5 my-2 animate-spin" />
                ) : (
                  <MagnifyingGlassIcon className="w-6 h-6 mx-3 sm:mx-5 my-2" />
                )}
              </div>
            }
          />
        </div>
        <div className="mt-3">
          <RadioGroup<(typeof sortFieldItems)[number]>
            accessKey="id"
            valueAs="key"
            keyName="id"
            name={fields.sort.name}
            disabled={isRefreshing}
            onChange={debouncedSubmit}
            // @ts-expect-error -- must be a string
            defaultValue={fields.sort.initialValue}
            variant={RadioGroupVariants.Radios}
            itemsWrapperClassName="flex flex-wrap gap-x-6 !space-y-0"
            items={sortFieldItems}
          />
        </div>
      </form>
    </aside>
  );
};
