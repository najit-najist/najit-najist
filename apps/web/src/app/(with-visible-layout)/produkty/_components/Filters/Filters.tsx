'use client';

import { Input, inputPrefixSuffixStyles } from '@components/common/form/Input';
import {
  RadioGroup,
  RadioGroupVariants,
} from '@components/common/form/RadioGroup';
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { ProductCategory } from '@najit-najist/database/models';
import { debounce } from 'es-toolkit';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useTransition } from 'react';
import { FormProvider, useController, useForm } from 'react-hook-form';

import { ProductsPageSortBy } from '../../_types';

type FormValues = {
  query?: string;
  sort?: ProductsPageSortBy;
};

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
  initialValues?: FormValues;
  categories: ProductCategory[];
}> = ({ initialValues }) => {
  const router = useRouter();
  const [isRefreshing, startRefreshing] = useTransition();
  const formMethods = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const { handleSubmit, register, watch, control } = formMethods;
  const { field: sortField } = useController({
    name: 'sort',
    control,
  });

  const onSubmit = useCallback<Parameters<typeof handleSubmit>[0]>(
    ({ query, sort = ProductsPageSortBy.RECOMMENDED }) => {
      let route = '/produkty';
      const queryParams = new URLSearchParams(window.location.search);

      const params = Object.entries({
        query,
        sort: sort !== ProductsPageSortBy.RECOMMENDED ? sort : undefined,
      });

      for (const [key, value] of params) {
        if (!value) {
          queryParams.delete(key);
        } else {
          queryParams.set(key, value);
        }
      }

      route += `?${queryParams.toString()}`;

      startRefreshing(() => {
        // @ts-ignore
        router.push(route);
      });
    },
    [router],
  );

  useEffect(() => {
    const debouncedSubmit = debounce(() => handleSubmit(onSubmit)(), 300);
    const subscription = watch(debouncedSubmit);

    return () => subscription.unsubscribe();
  }, [handleSubmit, onSubmit, watch]);

  return (
    <aside className="flex-none w-full mx-auto my-5 container">
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Vyhledávání..."
              rootClassName="w-full max-w-lg"
              suffix={
                <div className={inputPrefixSuffixStyles({ type: 'suffix' })}>
                  {formMethods.formState.isSubmitting || isRefreshing ? (
                    <ArrowPathIcon className="w-6 h-6 mx-3 sm:mx-5 my-2 animate-spin" />
                  ) : (
                    <MagnifyingGlassIcon className="w-6 h-6 mx-3 sm:mx-5 my-2" />
                  )}
                </div>
              }
              {...register('query')}
            />
          </div>
          <div className="mt-3">
            <RadioGroup<(typeof sortFieldItems)[number]>
              accessKey="id"
              valueAs="key"
              keyName="id"
              value={sortField.value as any}
              name={sortField.name}
              disabled={sortField.disabled}
              onBlur={sortField.onBlur}
              onChange={sortField.onChange}
              variant={RadioGroupVariants.Radios}
              itemsWrapperClassName="flex flex-wrap gap-x-6 !space-y-0"
              items={sortFieldItems}
            />
          </div>
        </form>
      </FormProvider>
    </aside>
  );
};
