'use client';

import { trpc } from '@client/trpc';
import { RecipeWithRelations } from '@custom-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@najit-najist/ui';
import { recipeCreateInputSchema } from '@server/schemas/recipeCreateInputSchema';
import { recipeUpdateInputSchema } from '@server/schemas/recipeUpdateInputSchema';
import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { RecipeFormData } from '../_types';

export const Form: FC<
  PropsWithChildren<{
    recipe?: RecipeWithRelations;
    viewType: 'edit' | 'create';
  }>
> = ({ recipe, children, viewType }) => {
  const router = useRouter();
  const formMethods = useForm<RecipeFormData>({
    defaultValues: {
      steps: [],
      resources: [],
      ...recipe,
      images: recipe?.images.map(({ file }) => file),
      numberOfPortions: recipe?.numberOfPortions ?? 1,
    },
    resolver: zodResolver(
      viewType === 'edit' ? recipeUpdateInputSchema : recipeCreateInputSchema
    ),
  });
  const { handleSubmit } = formMethods;
  const { mutateAsync: updateRecipe } = trpc.recipes.update.useMutation();
  const { mutateAsync: createRecipe } = trpc.recipes.create.useMutation();

  const onSubmit = useCallback<Parameters<typeof handleSubmit>['0']>(
    async (values) => {
      if (viewType === 'edit') {
        const action = updateRecipe({
          id: recipe!.id,
          data: {
            title: values.title,
            description: values.description,
            resources: values.resources,
            steps: values.steps,
            difficulty: values.difficulty,
            category: values.category,
            images: values.images,
            numberOfPortions: values.numberOfPortions ?? 1,
          },
        });

        toast.promise(action, {
          loading: 'Ukládám úpravy',
          success: <b>Recept upraven!</b>,
          error: (error) => <b>Nemohli uložit úpravy. {error.message}</b>,
        });

        const result = await action;

        router.push(`/recepty/${result.slug}?editor=true`);
      } else if (viewType === 'create') {
        const action = createRecipe({
          title: values.title,
          description: values.description,
          resources: values.resources,
          steps: values.steps,
          difficulty: values.difficulty,
          category: values.category,
          images: values.images,
          numberOfPortions: values.numberOfPortions ?? 1,
        });

        toast.promise(action, {
          loading: 'Vytvářím recept',
          success: <b>Recept uložen!</b>,
          error: (error) => <b>Recept nemohl být vytvořen. {error.message}</b>,
        });

        const result = await action;

        router.push(`/recepty/${result.slug}`);
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
