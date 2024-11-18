'use client';

import { RecipeWithRelations } from '@custom-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@najit-najist/ui';
import { recipeCreateInputSchema } from '@server/schemas/recipeCreateInputSchema';
import { recipeUpdateInputSchema } from '@server/schemas/recipeUpdateInputSchema';
import { handlePromiseForToast } from '@utils/handleActionForToast';
import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { RecipeFormData } from '../_types';
import { createRecipeAction } from '../actions/createRecipeAction';
import { updateRecipeAction } from '../actions/updateRecipeAction';

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
      viewType === 'edit' ? recipeUpdateInputSchema : recipeCreateInputSchema,
    ),
  });
  const { handleSubmit } = formMethods;

  const onSubmit = useCallback<Parameters<typeof handleSubmit>['0']>(
    async (values) => {
      if (viewType === 'edit') {
        const action = updateRecipeAction({
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

        toast.promise(handlePromiseForToast(action), {
          loading: 'Ukládám úpravy',
          success: <b>Recept upraven!</b>,
          error: (error) => <b>Nemohli se uložit úpravy. {error.message}</b>,
        });

        await action;
        router.refresh();
      } else if (viewType === 'create') {
        const action = createRecipeAction({
          title: values.title,
          description: values.description,
          resources: values.resources,
          steps: values.steps,
          difficulty: values.difficulty,
          category: values.category,
          images: values.images,
          numberOfPortions: values.numberOfPortions ?? 1,
        });

        toast.promise(handlePromiseForToast(action), {
          loading: 'Vytvářím recept',
          success: <b>Recept uložen!</b>,
          error: (error) => <b>Recept nemohl být vytvořen. {error.message}</b>,
        });

        await action;
      }
    },
    [router, viewType, recipe],
  );

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};
