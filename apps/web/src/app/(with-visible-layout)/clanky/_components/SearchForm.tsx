'use client';

import { Input, inputPrefixSuffixStyles } from '@components/common/form/Input';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import {  useRouter } from 'next/navigation';
import { FC, useRef, useTransition } from 'react';
import { searchPostSchema } from '../searchPostSchema';
import { useDebounceCallback } from 'usehooks-ts';

type FormData = { query?: string };

export const SearchForm: FC<{ initialData?: Partial<FormData> }> = ({
  initialData,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isRefreshing, startRefreshing] = useTransition();

  const [form, fields] = useForm({
    defaultValue: initialData,
    onSubmit(event, { submission }) {
      event.preventDefault()

      if (submission?.status === 'success') {
        const queryParams = new URLSearchParams(window.location.search);

        const params = Object.entries({
          query: submission?.value?.query,
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
      parseWithZod(formData, { schema: searchPostSchema }),
  });

  const debouncedSubmit = useDebounceCallback(() => {
    formRef.current?.requestSubmit();
  }, 300);

  return (
    <form id={form.id} onSubmit={form.onSubmit} noValidate ref={formRef}>
      <Input
        placeholder="Vyhledávání..."
        rootClassName="max-w-sm"
        size="normal"
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
    </form>
  );
};
