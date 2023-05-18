'use client';

import { Input } from '@najit-najist/ui';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

export const SearchForm: FC = () => {
  const { register } = useForm();

  return (
    <form className="mb-10">
      <Input label="Vyhledávání" {...register('query')} />
    </form>
  );
};
