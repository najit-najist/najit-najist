'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  createRecipeInputSchema,
  Recipe,
  updateRecipeInputSchema,
} from '@najit-najist/api';
import { trpc } from '@trpc';
import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { RecipeFormData } from '../_types';

const getStringId = (input: string | { id: string; [x: string]: any }) =>
  typeof input === 'object' ? input.id : input;

export const Form: FC<
  PropsWithChildren<{ recipe?: Recipe; viewType: 'edit' | 'create' }>
> = ({ recipe, children, viewType }) => {
  const router = useRouter();
  const formMethods = useForm<RecipeFormData>({
    defaultValues: {
      numberOfPortions: 1,
      steps: [],
      resources: [],
      ...recipe,
      type: recipe?.type.id,
      difficulty: recipe?.difficulty.id,
    },
    resolver: zodResolver(
      viewType === 'edit' ? updateRecipeInputSchema : createRecipeInputSchema
    ),
  });
  const { handleSubmit } = formMethods;
  const { mutateAsync: updateRecipe } = trpc.recipes.update.useMutation();
  const { mutateAsync: createRecipe } = trpc.recipes.create.useMutation();

  const onSubmit = useCallback<Parameters<typeof handleSubmit>['0']>(
    async (values) => {
      if (viewType === 'edit') {
        await updateRecipe({
          id: recipe!.id,
          data: {
            title: values.title,
            description: values.description,
            resources: values.resources,
            steps: values.steps,
            difficulty: getStringId(values.difficulty),
            type: getStringId(values.type),
            images: values.images,
          },
        });

        router.refresh();
      } else if (viewType === 'create') {
        const data = await createRecipe({
          title: values.title,
          description: values.description,
          resources: values.resources,
          steps: values.steps,
          difficulty: getStringId(values.difficulty),
          type: getStringId(values.type),
          images: values.images,
          numberOfPortions: values.numberOfPortions,
        });

        router.push(`/recepty/${data.slug}`);
      }
    },
    [createRecipe, router, updateRecipe, viewType, recipe]
  );

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};
