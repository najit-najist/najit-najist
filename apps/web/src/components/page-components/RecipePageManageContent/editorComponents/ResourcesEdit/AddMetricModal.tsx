import { trpc } from '@client/trpc';
import { ErrorCodes } from '@custom-types/ErrorCodes';
import { zodResolver } from '@hookform/resolvers/zod';
import { RecipeResourceMetric } from '@najit-najist/database/models';
import { Button, Input, Modal, ModalProps } from '@najit-najist/ui';
import { recipeResourceCreateInputSchema } from '@server/schemas/recipeResourceCreateInputSchema';
import { TRPCClientError } from '@trpc/client';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

export const AddMetricModal: FC<Pick<ModalProps, 'open' | 'onClose'>> = ({
  open,
  onClose,
}) => {
  const { mutateAsync: create } = trpc.recipes.metrics.create.useMutation();
  const { register, formState, handleSubmit, setError, reset } = useForm<
    Pick<RecipeResourceMetric, 'name'>
  >({
    defaultValues: { name: '' },
    resolver: zodResolver(recipeResourceCreateInputSchema),
  });

  const onSubmit: Parameters<typeof handleSubmit>['0'] = async (input) => {
    try {
      await create(input);
      onClose(false);
      reset();
    } catch (error) {
      if (
        error instanceof TRPCClientError &&
        error.message.includes(ErrorCodes.ENTITY_DUPLICATE)
      ) {
        setError('name', {
          message: 'Tato metrika již existuje',
          type: ErrorCodes.ENTITY_DUPLICATE,
        });
      } else {
        throw error;
      }
    }
  };

  return (
    <Modal open={open} onClose={() => onClose(false)}>
      <h2 className="text-sm font-semibold uppercase">Nová metrika</h2>

      <hr className="w-full h-0.5 bg-gray-100 my-3" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Název"
          size="md"
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
            onClick={() => {
              onClose(false);
              reset();
            }}
          >
            Zavřít
          </Button>
        </div>
      </form>
    </Modal>
  );
};
