'use client';

import { Button } from '@components/common/Button';
import { Modal } from '@components/common/Modal';
import { ColorPicker } from '@components/common/form/ColorPicker';
import { Input } from '@components/common/form/Input';
import { Select } from '@components/common/form/Select';
import { ErrorCodes, RecipeWithRelations } from '@custom-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { RecipeDifficulty } from '@najit-najist/database/models';
import { recipeDifficultyCreateInputSchema } from '@server/schemas/recipeDifficultyCreateInputSchema';
import { TRPCClientError } from '@trpc/client';
import { trpc } from '@trpc/web';
import { FC, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

type FormData = z.infer<typeof recipeDifficultyCreateInputSchema>;

export const DifficultyEdit: FC<{ difficulties: RecipeDifficulty[] }> = ({
  difficulties: initialDifficulties,
}) => {
  const { data: difficulties, refetch } =
    trpc.recipes.difficulties.getMany.useQuery(undefined, {
      initialData: {
        items: initialDifficulties,
        nextToken: null,
        total: initialDifficulties.length,
      },
      refetchInterval: 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const { mutateAsync: create } =
    trpc.recipes.difficulties.create.useMutation();
  const formMethods = useForm<FormData>({
    resolver: zodResolver(recipeDifficultyCreateInputSchema),
  });
  const { handleSubmit, register, formState, reset, setError } = formMethods;

  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const difficultiesSet = useMemo(
    () => new Map(difficulties.items.map((item) => [item.id, item])),
    [difficulties],
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
            type: ErrorCodes.ENTITY_DUPLICATE,
          });
        } else {
          setError('color', {
            message: 'Tato barva patří už k jiné složitosti',
            type: ErrorCodes.ENTITY_DUPLICATE,
          });
        }
      } else {
        throw error;
      }
    }
  };

  return (
    <>
      <Controller<Pick<RecipeWithRelations, 'difficulty'>>
        name="difficulty"
        render={({ field, fieldState, formState }) => (
          <Select<RecipeDifficulty>
            name={field.name}
            selected={difficultiesSet.get(
              typeof field.value === 'string'
                ? Number(field.value)
                : (field.value as RecipeDifficulty)?.id,
            )}
            formatter={({ name }) => name}
            items={difficulties.items}
            disabled={formState.isSubmitting}
            onChange={(item) => field.onChange(item)}
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
            <div className="mt-5 flex gap-4">
              <Button isLoading={formState.isSubmitting} type="submit">
                Vytvořit a zavřít
              </Button>
              <Button
                disabled={formState.isSubmitting}
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
