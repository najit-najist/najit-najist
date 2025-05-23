'use client';

import { Button } from '@components/common/Button';
import { Modal } from '@components/common/Modal';
import { Input } from '@components/common/form/Input';
import { Select } from '@components/common/form/Select';
import { ErrorCodes } from '@custom-types/ErrorCodes';
import { zodResolver } from '@hookform/resolvers/zod';
import { RecipeCategory } from '@najit-najist/database/models';
import { recipeCategoryCreateInputSchema } from '@server/schemas/recipeCategoryCreateInputSchema';
import { TRPCClientError } from '@trpc/client';
import { trpc } from '@trpc/web';
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
    },
  );

  const { mutateAsync: create } = trpc.recipes.types.create.useMutation();
  const formMethods = useForm<FormData>({
    resolver: zodResolver(recipeCategoryCreateInputSchema),
  });
  const { handleSubmit, register, formState, reset, setError } = formMethods;

  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const typesSet = useMemo(
    () => new Map(types.items.map((item) => [item.id, item])),
    [types],
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
              typeof field.value === 'number' ? field.value : field.value?.id,
            )}
            formatter={({ title }) => title}
            items={types.items}
            disabled={formState.isSubmitting}
            onChange={(item) => field.onChange(item)}
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
            <div className="mt-5 flex gap-4">
              <Button
                isLoading={formState.isSubmitting}
                type="submit"
                size="sm"
              >
                Přidat
              </Button>
              <Button
                disabled={formState.isSubmitting}
                size="sm"
                appearance="link"
                color="red"
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
