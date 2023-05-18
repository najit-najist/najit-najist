'use client';

import { Recipe } from '@najit-najist/api';
import { trpc } from '@trpc';
import { useRouter } from 'next/navigation';
import { FC, PropsWithChildren, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export const Form: FC<
  PropsWithChildren<{ recipe?: Recipe; viewType: 'edit' | 'create' }>
> = ({ recipe, children, viewType }) => {
  const router = useRouter();
  const formMethods = useForm<Recipe>({
    defaultValues: recipe,
  });
  const { handleSubmit } = formMethods;
  const { mutateAsync: updateRecipe } = trpc.recipes.update.useMutation();
  const { mutateAsync: createRecipe } = trpc.recipes.create.useMutation();

  const onSubmit = useCallback<Parameters<typeof handleSubmit>['0']>(
    async (values) => {
      if (viewType === 'edit') {
        await updateRecipe({
          id: values.id,
          data: {
            title: values.title,
            description: values.description,
            resources: values.resources,
            steps: values.steps,
          },
        });
      } else if (viewType === 'create') {
        const data = await createRecipe({
          title: values.title,
          description: values.description,
          resources: values.resources,
          steps: values.steps,
          images: [],
        });

        router.push(`/recepty/${data.slug}`);
      }
    },
    [createRecipe, router, updateRecipe, viewType]
  );

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
};
