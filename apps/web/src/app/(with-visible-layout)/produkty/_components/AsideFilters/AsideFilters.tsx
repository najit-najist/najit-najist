'use client';

import {
  AdjustmentsVerticalIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useIsDesktop } from '@hooks';
import { ProductCategory } from '@najit-najist/api';
import {
  Button,
  CheckboxGroup,
  Input,
  inputPrefixSuffixStyles,
} from '@najit-najist/ui';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useMemo, useTransition } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useIsClient } from 'usehooks-ts';

type FormValues = {
  query?: string;
  categories?: ProductCategory[];
};

export const AsideFilters: FC<{
  initialValues?: FormValues;
  categories: ProductCategory[];
}> = ({ initialValues, categories }) => {
  const router = useRouter();
  const isDesktop = useIsDesktop();
  const isClient = useIsClient();
  const [isRefreshing, startRefreshing] = useTransition();
  const formMethods = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const { handleSubmit, register, watch } = formMethods;

  const onSubmit = useCallback<Parameters<typeof handleSubmit>[0]>(
    ({ query, categories }) => {
      let route = '/produkty';
      const params = [
        ['query', query],
        [
          'category-slug',
          categories
            ?.filter((item) => Boolean(item.slug))
            .map((item) => item.slug)
            .join(','),
        ],
      ].filter(([_, value]) => !!value) as string[][];

      if (params.length) {
        const queryParams = new URLSearchParams(params);

        route += `?${queryParams.toString()}`;
      }

      startRefreshing(() => {
        // @ts-ignore
        router.push(route);
      });
    },
    [router]
  );

  useEffect(() => {
    const debouncedSubmit = debounce(() => handleSubmit(onSubmit)(), 300);
    const subscription = watch(debouncedSubmit);

    return () => subscription.unsubscribe();
  }, [handleSubmit, onSubmit, watch]);

  const content = (
    <FormProvider {...formMethods}>
      <form
        className="divide-y-2 [&>*:not(:first-child)]:pt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          placeholder="Vyhledávání..."
          rootClassName="w-full"
          suffix={
            <div className={inputPrefixSuffixStyles({ type: 'suffix' })}>
              {formMethods.formState.isSubmitting || isRefreshing ? (
                <ArrowPathIcon className="w-6 h-6 mx-5 my-2 animate-spin" />
              ) : (
                <MagnifyingGlassIcon className="w-6 h-6 mx-5 my-2" />
              )}
            </div>
          }
          {...register('query')}
        />

        <Controller<FormValues>
          name="categories"
          render={({ field: { name, value, onChange } }) => (
            <CheckboxGroup
              rootClassName="mt-5"
              name={name}
              label="Kategorie"
              titleField="name"
              options={categories}
              value={value as any}
              onChange={(callback) => onChange(callback(value as any))}
            />
          )}
        />
      </form>
    </FormProvider>
  );

  return (
    <>
      <aside className="flex-none w-full max-w-[18rem]">
        <Button
          color="secondary"
          notRounded
          appearance="spaceless"
          padding="sm"
          className="rounded-full text-xl block sm:hidden"
        >
          <AdjustmentsVerticalIcon className="w-6 h-6 inline mr-2" />
          Filtrovat
        </Button>
        {isDesktop || !isClient ? content : null}
      </aside>
    </>
  );
};
