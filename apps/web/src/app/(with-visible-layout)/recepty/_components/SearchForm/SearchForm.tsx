'use client';

import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { RecipeDifficulty } from '@najit-najist/api';
import { Input, Select } from '@najit-najist/ui';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useMemo, useTransition } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

const typeLabelFormatter = (value: RecipeDifficulty) => value.name;
type FormValues = {
  query?: string;
  difficultySlug?: string;
};

export const SearchForm: FC<{
  difficulties: RecipeDifficulty[];
  initialValues?: Partial<FormValues>;
}> = ({ difficulties, initialValues }) => {
  const router = useRouter();
  const [isRefreshing, startRefreshing] = useTransition();
  const formMethods = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const { handleSubmit, register, watch } = formMethods;
  const difficultiesMap = useMemo(
    () => new Map(difficulties.map((item) => [item.slug, item])),
    [difficulties]
  );

  const onSubmit = useCallback<Parameters<typeof handleSubmit>[0]>(
    ({ difficultySlug, query }) => {
      let route = '/recepty';
      const params = [
        ['query', query],
        ['difficulty', difficultySlug],
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

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container my-10 flex w-full gap-5 items-end"
      >
        <Input
          placeholder="Vyhledávání..."
          rootClassName="w-full"
          suffix={
            formMethods.formState.isSubmitting || isRefreshing ? (
              <ArrowPathIcon className="w-6 h-6 mx-5 my-2 animate-spin" />
            ) : (
              <MagnifyingGlassIcon className="w-6 h-6 mx-5 my-2" />
            )
          }
          {...register('query')}
        />
        <Controller<FormValues>
          name="difficultySlug"
          render={({ field: { name, value, onChange } }) => (
            <Select<RecipeDifficulty>
              name={name}
              label="Náročnost"
              selected={difficultiesMap.get(value ?? '')}
              onChange={(item) => onChange(item.slug)}
              formatter={typeLabelFormatter}
              items={difficulties}
              className="max-w-xs w-full"
            />
          )}
        />
      </form>
    </FormProvider>
  );
};
