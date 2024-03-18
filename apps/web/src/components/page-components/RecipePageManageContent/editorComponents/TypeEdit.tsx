'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorCodes, recipeCategoryCreateInputSchema } from '@najit-najist/api';
import { RecipeCategory } from '@najit-najist/database/models';
import { Button, Input, Modal, Select } from '@najit-najist/ui';
import { trpc } from '@trpc';
import { TRPCClientError } from '@trpc/client';
import { FC, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { RecipeFormData } from '../_types';

type FormData = z.infer<typeof recipeCategoryCreateInputSchema>;

export const TypeEdit: FC<{ types: RecipeCategory[] }> = ({
  types: initialTypes,
}) => {
  const { data: types, refetch } = trpc.recipes.types.getMany.useQuery(
    undefined,
    {
      initialData: {
        items: initialTypes,
        nextToken: null,
        total: initialTypes.length,
      },
      refetchInterval: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { mutateAsync: create } = trpc.recipes.types.create.useMutation();
  const formMethods = useForm<FormData>({
    resolver: zodResolver(recipeCategoryCreateInputSchema),
  });
  const { handleSubmit, register, formState, reset, setError } = formMethods;

  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const typesSet = useMemo(
    () => new Map(types.items.map((item) => [item.id, item])),
    [types]
  );

  const closeModal = () => {
    setAddItemModalOpen(false);
    refetch();
  };
  const openModal = () => setAddItemModalOpen(true);
  const onSubmit: Parameters<typeof handleSubmit>['0'] = async (input) => {
    try {
      await create(input);
      closeModal();
      reset();
    } catch (error) {
      if (
        error instanceof TRPCClientError &&
        error.message.includes(ErrorCodes.ENTITY_DUPLICATE)
      ) {
        setError('title', {
          message: 'Tento typ již existuje',
          type: ErrorCodes.ENTITY_DUPLICATE,
        });
      } else {
        throw error;
      }
    }
  };

  return (
    <>
      <Controller<Pick<RecipeFormData, 'category'>>
        name="category"
        render={({ field, fieldState, formState }) => (
          <Select<RecipeCategory>
            name={field.name}
            selected={typesSet.get(
              typeof field.value === 'number' ? field.value : field.value?.id
            )}
            formatter={({ title }) => title}
            items={types.items}
            disabled={formState.isSubmitting}
            onChange={(item) => field.onChange(item?.id)}
            error={fieldState.error}
            className="min-w-[150px]"
            onAddNewItem={openModal}
          />
        )}
      />
      <Modal onClose={closeModal} open={addItemModalOpen}>
        <h2 className="text-sm font-semibold uppercase">Nový typ receptu</h2>

        <hr className="w-full h-0.5 bg-gray-100 my-3" />

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              placeholder="Název"
              error={formState.errors.title}
              {...register('title')}
            />
            <div className="mt-5 flex gap-2">
              <Button
                isLoading={formState.isSubmitting}
                type="submit"
                appearance="small"
              >
                Přidat
              </Button>
              <Button
                disabled={formState.isSubmitting}
                appearance="small"
                color="white"
                onClick={closeModal}
              >
                Zavřít
              </Button>
            </div>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};
