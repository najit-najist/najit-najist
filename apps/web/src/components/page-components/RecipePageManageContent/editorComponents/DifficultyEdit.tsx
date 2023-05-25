'use client';

import { Recipe, RecipeDifficulty } from '@najit-najist/api';
import { Select } from '@najit-najist/ui';
import { FC, useMemo } from 'react';
import { Controller } from 'react-hook-form';

export const DifficultyEdit: FC<{ difficulties: RecipeDifficulty[] }> = ({
  difficulties,
}) => {
  const difficultiesSet = useMemo(
    () => new Map(difficulties.map((item) => [item.id, item])),
    [difficulties]
  );

  return (
    <Controller<Pick<Recipe, 'difficulty'>>
      name="difficulty"
      render={({ field, fieldState, formState }) => (
        <Select<RecipeDifficulty>
          name={field.name}
          selected={difficultiesSet.get(
            typeof field.value === 'string' ? field.value : field.value?.id
          )}
          formatter={({ name }) => name}
          items={difficulties}
          disabled={formState.isSubmitting}
          onChange={({ id }) => field.onChange(id)}
          error={fieldState.error}
        />
      )}
    />
  );
};
