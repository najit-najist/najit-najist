'use client';

import { Input, inputPrefixSuffixStyles } from '@components/common/form/Input';
import { Select } from '@components/common/form/Select';
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import {
  RecipeCategory,
  RecipeDifficulty,
} from '@najit-najist/database/models';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useMemo, useTransition } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

const typeLabelFormatter = (value: RecipeDifficulty) => value.name;
const typesLabelFormatter = (value: RecipeCategory) => value.title;
type FormValues = {
  query?: string;
  difficultySlug?: string;
  typeSlug?: string;
};

export const SearchForm: FC<{
  difficulties: RecipeDifficulty[];
  types: RecipeCategory[];
  initialValues?: Partial<FormValues>;
}> = ({ difficulties, types, initialValues }) => {
  const router = useRouter();
  const [isRefreshing, startRefreshing] = useTransition();
  const formMethods = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const { handleSubmit, register, watch } = formMethods;
  const difficultiesMap = useMemo(
    () => new Map(difficulties.map((item) => [item.slug, item])),
    [difficulties],
  );
  const typesAsMap = useMemo(
    () => new Map(types.map((item) => [item.slug, item])),
    [types],
  );

  const onSubmit = useCallback<Parameters<typeof handleSubmit>[0]>(
    ({ difficultySlug, query, typeSlug }) => {
      let route = '/recepty';
      const params = [
        ['query', query],
        ['difficulty', difficultySlug],
        ['type', typeSlug],
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
    [router],
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
        className="container my-10 flex flex-col-reverse md:flex-row w-full gap-5 items-end"
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
          name="typeSlug"
          render={({ field: { name, value, onChange } }) => (
            <Select<RecipeCategory>
              name={name}
              label="Typ"
              selected={typesAsMap.get(value ?? '')}
              onChange={(item) => onChange(item?.slug)}
              formatter={typesLabelFormatter}
              items={types}
              className="md:max-w-[240px] w-full"
            />
          )}
        />
        <Controller<FormValues>
          name="difficultySlug"
          render={({ field: { name, value, onChange } }) => (
            <Select<RecipeDifficulty>
              name={name}
              label="Náročnost"
              selected={difficultiesMap.get(value ?? '')}
              onChange={(item) => onChange(item?.slug)}
              formatter={typeLabelFormatter}
              items={difficulties}
              className="md:max-w-[240px] w-full"
            />
          )}
        />
      </form>
    </FormProvider>
  );
};
