'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Input } from '@najit-najist/ui';
import { FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';

export const SearchForm: FC = () => {
  const formMethods = useForm();
  const { handleSubmit, register } = formMethods;

  const onSubmit = useCallback(() => {}, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        placeholder="Vyhledávání..."
        rootClassName="max-w-sm"
        size="normal"
        suffix={<MagnifyingGlassIcon className="w-6 h-6 mx-5 my-2" />}
        {...register('query')}
      />
    </form>
  );
};
