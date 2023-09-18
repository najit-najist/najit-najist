'use client';

import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { RecipeDifficulty, RecipeType } from '@najit-najist/api';
import { Input, Select } from '@najit-najist/ui';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useEffect, useMemo, useTransition } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

type FormValues = {
  query?: string;
};

export const SearchForm: FC<{ initialValues?: FormValues }> = ({
  initialValues,
}) => {
  const router = useRouter();
  const [isRefreshing, startRefreshing] = useTransition();
  const formMethods = useForm<FormValues>({
    defaultValues: initialValues,
  });
  const { handleSubmit, register, watch } = formMethods;

  const onSubmit = useCallback<Parameters<typeof handleSubmit>[0]>(
    ({ query }) => {
      let route = '/produkty';
      const params = [['query', query]].filter(
        ([_, value]) => !!value
      ) as string[][];

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
        className="container my-10 flex flex-col-reverse md:flex-row w-full gap-5 items-end"
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
      </form>
    </FormProvider>
  );
};
