'use client';

import { RecipeDifficulty } from '@najit-najist/api';
import { Button, Input, Select } from '@najit-najist/ui';
import { useRouter } from 'next/navigation';
import { FC, useCallback, useTransition } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

const typeLabelFormatter = (value: RecipeDifficulty) => value.name;
type FormValues = {
  query?: string;
  difficulty?: RecipeDifficulty;
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
  const { handleSubmit, register } = formMethods;

  const onSubmit = useCallback<Parameters<typeof handleSubmit>[0]>(
    ({ difficulty, query }) => {
      const queryParams = new URLSearchParams(
        [
          ['query', query],
          ['difficulty', difficulty?.slug],
        ].filter(([_, value]) => !!value) as string[][]
      );

      startRefreshing(() => {
        router.push(`/recepty?${queryParams.toString()}`);
      });
    },
    [router]
  );

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="container my-10 flex w-full gap-5 items-end"
      >
        <Input
          placeholder="Vyhledávání"
          rootClassName="w-full"
          {...register('query')}
        />
        <Controller<FormValues>
          name="difficulty"
          render={({ field: { name, value, onChange } }) => (
            <Select<RecipeDifficulty>
              name={name}
              label="Náročnost"
              selected={typeof value !== 'string' ? value : undefined}
              onChange={onChange}
              formatter={typeLabelFormatter}
              items={difficulties}
              className="max-w-xs w-full"
            />
          )}
        />
        <Button disabled={isRefreshing} appearance="small">
          Submit
        </Button>
      </form>
    </FormProvider>
  );
};
