'use client';

import { Input, inputPrefixSuffixStyles } from '@components/common/form/Input';
import { Select } from '@components/common/form/Select';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import {
  RecipeCategory,
  RecipeDifficulty,
} from '@najit-najist/database/models';
import { useRouter } from 'next/navigation';
import { FC, useMemo, useRef, useTransition } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { z } from 'zod';

import { searchRecipeSchema } from '../../searchRecipeSchema';

const typeLabelFormatter = (value: RecipeDifficulty) => value.name;
const typesLabelFormatter = (value: RecipeCategory) => value.title;

export const SearchForm: FC<{
  difficulties: RecipeDifficulty[];
  types: RecipeCategory[];
  initialValues?: z.input<typeof searchRecipeSchema>;
}> = ({ difficulties, types, initialValues }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isRefreshing, startRefreshing] = useTransition();

  const difficultiesMap = useMemo(
    () => new Map(difficulties.map((item) => [item.slug, item])),
    [difficulties],
  );
  const typesAsMap = useMemo(
    () => new Map(types.map((item) => [item.slug, item])),
    [types],
  );

  const [form, fields] = useForm({
    defaultValue: initialValues,
    onSubmit(event, { submission }) {
      event.preventDefault();

      if (submission?.status === 'success') {
        const queryParams = new URLSearchParams(window.location.search);

        const params = Object.entries({
          query: submission.value.query,
          difficulty: submission.value['difficulty[slug]'],
          type: submission.value['type[slug]'],
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
      parseWithZod(formData, { schema: searchRecipeSchema }),
  });

  const debouncedSubmit = useDebounceCallback(() => {
    formRef.current?.requestSubmit();
  }, 300);

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      noValidate
      ref={formRef}
      className="container mb-10 flex flex-col-reverse md:flex-row w-full gap-5 items-end"
    >
      <Input
        placeholder="Vyhledávání..."
        rootClassName="w-full"
        suffix={
          <div className={inputPrefixSuffixStyles({ type: 'suffix' })}>
            {isRefreshing ? (
              <ArrowPathIcon className="w-6 h-6 mx-5 my-2 animate-spin" />
            ) : (
              <MagnifyingGlassIcon className="w-6 h-6 mx-5 my-2" />
            )}
          </div>
        }
        onChange={debouncedSubmit}
        name={fields.query.name}
        defaultValue={form.initialValue?.query}
      />
      <Select<RecipeCategory>
        label="Typ"
        formatter={typesLabelFormatter}
        items={types}
        className="md:max-w-[240px] w-full"
        onChange={() => debouncedSubmit()}
        name={'type'}
        defaultValue={typesAsMap.get(form.initialValue?.['type[slug]'] ?? '')}
      />
      <Select<RecipeDifficulty>
        label="Náročnost"
        formatter={typeLabelFormatter}
        items={difficulties}
        className="md:max-w-[240px] w-full"
        onChange={() => debouncedSubmit()}
        name={'difficulty'}
        defaultValue={difficultiesMap.get(
          form.initialValue?.['difficulty[slug]'] ?? '',
        )}
      />
    </form>
  );
};
