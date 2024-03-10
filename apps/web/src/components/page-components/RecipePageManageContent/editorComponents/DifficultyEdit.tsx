'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateRecipeDifficultyInput,
  ErrorCodes,
  PocketbaseErrorCodes,
  Recipe,
  RecipeDifficulty,
} from '@najit-najist/api';
import { Button, ColorPicker, Input, Modal, Select } from '@najit-najist/ui';
import { trpc } from '@trpc';
import { TRPCClientError } from '@trpc/client';
import { FC, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

export const DifficultyEdit: FC<{ difficulties: RecipeDifficulty[] }> = ({
  difficulties: initialDifficulties,
}) => {
  const { data: difficulties, refetch } =
    trpc.recipes.difficulties.getMany.useQuery(undefined, {
      initialData: {
        items: initialDifficulties,
        page: 1,
        perPage: initialDifficulties.length,
        totalItems: initialDifficulties.length,
        totalPages: 1,
      },
      refetchInterval: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const { mutateAsync: create } =
    trpc.recipes.difficulties.create.useMutation();
  const formMethods = useForm<CreateRecipeDifficultyInput>({
    resolver: zodResolver(recipeDifficultyCreateInputSchema),
  });
  const { handleSubmit, register, formState, reset, setError } = formMethods;

  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const difficultiesSet = useMemo(
    () => new Map(difficulties.items.map((item) => [item.id, item])),
    [difficulties]
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
        if (error.message.includes('color')) {
          setError('name', {
            message: 'Tato složitost již existuje',
            type: PocketbaseErrorCodes.NOT_UNIQUE,
          });
        } else {
          setError('color', {
            message: 'Tato barva patří už k jiné složitosti',
            type: PocketbaseErrorCodes.NOT_UNIQUE,
          });
        }
      } else {
        throw error;
      }
    }
  };

  return (
    <>
      <Controller<Pick<Recipe, 'difficulty'>>
        name="difficulty"
        render={({ field, fieldState, formState }) => (
          <Select<RecipeDifficulty>
            name={field.name}
            selected={difficultiesSet.get(
              typeof field.value === 'string' ? field.value : field.value?.id
            )}
            formatter={({ name }) => name}
            items={difficulties.items}
            disabled={formState.isSubmitting}
            onChange={(item) => field.onChange(item?.id)}
            error={fieldState.error}
            onAddNewItem={openModal}
            className="min-w-[150px]"
          />
        )}
      />
      <Modal onClose={closeModal} open={addItemModalOpen}>
        <h2 className="text-sm font-semibold uppercase">
          Nová složitost receptu
        </h2>

        <hr className="w-full h-0.5 bg-gray-100 my-3" />

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              placeholder="Název"
              error={formState.errors.name}
              {...register('name')}
            />
            <ColorPicker
              name="color"
              title="Barva"
              wrapperClassName="mt-3"
              error={formState.errors.color}
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
