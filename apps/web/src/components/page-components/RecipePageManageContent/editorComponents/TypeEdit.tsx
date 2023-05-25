'use client';

import { RecipeType } from '@najit-najist/api';
import { Select } from '@najit-najist/ui';
import { FC, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { RecipeFormData } from '../_types';

export const TypeEdit: FC<{ types: RecipeType[] }> = ({ types }) => {
  const typesSet = useMemo(
    () => new Map(types.map((item) => [item.id, item])),
    [types]
  );

  return (
    <Controller<Pick<RecipeFormData, 'type'>>
      name="type"
      render={({ field, fieldState, formState }) => (
        <Select<RecipeType>
          name={field.name}
          selected={typesSet.get(field.value)}
          formatter={({ title }) => title}
          items={types}
          disabled={formState.isSubmitting}
          onChange={({ id }) => field.onChange(id)}
          error={fieldState.error}
        />
      )}
    />
  );
};
