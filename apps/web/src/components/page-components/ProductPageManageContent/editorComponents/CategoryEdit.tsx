'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AppRouterInput,
  createProductCategorySchema,
  ErrorCodes,
  PocketbaseErrorCodes,
  ProductCategory,
} from '@najit-najist/api';
import { Button, Input, Modal, Select } from '@najit-najist/ui';
import { trpc } from '@trpc';
import { TRPCClientError } from '@trpc/client';
import { FC, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { ProductFormData } from '../_types';

export const CategoryEdit: FC<{ categories: ProductCategory[] }> = ({
  categories: initialCategories,
}) => {
  const { data: types, refetch } = trpc.products.categories.get.many.useQuery(
    undefined,
    {
      initialData: {
        items: initialCategories,
        page: 1,
        perPage: initialCategories.length,
        totalItems: initialCategories.length,
        totalPages: 1,
      },
      refetchInterval: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const { mutateAsync: create } = trpc.products.categories.create.useMutation();
  const formMethods = useForm<
    AppRouterInput['products']['categories']['create']
  >({
    resolver: zodResolver(createProductCategorySchema.omit({ slug: true })),
  });
  const { handleSubmit, register, formState, reset, setError } = formMethods;

  const [addItemModalOpen, setAddItemModalOpen] = useState(false);

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
        setError('name', {
          message: 'Tato categorie již existuje',
          type: PocketbaseErrorCodes.NOT_UNIQUE,
        });
      } else {
        throw error;
      }
    }
  };

  return (
    <>
      <Controller<Pick<ProductFormData, 'category'>>
        name="category"
        render={({ field, fieldState, formState }) => (
          <Select<ProductCategory>
            name={field.name}
            selected={(field.value ?? null) as any}
            formatter={({ name }) => name}
            items={types.items}
            disabled={formState.isSubmitting}
            onChange={(nextValue) =>
              nextValue ? field.onChange(nextValue) : null
            }
            error={fieldState.error}
            className="min-w-[150px]"
            onAddNewItem={openModal}
            fallbackButtonContents="Ostatní"
          />
        )}
      />
      <Modal onClose={closeModal} open={addItemModalOpen}>
        <h2 className="text-sm font-semibold uppercase">
          Nová kategorie produktu
        </h2>

        <hr className="w-full h-0.5 bg-gray-100 my-3" />

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              placeholder="Název"
              error={formState.errors.name}
              {...register('name')}
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
