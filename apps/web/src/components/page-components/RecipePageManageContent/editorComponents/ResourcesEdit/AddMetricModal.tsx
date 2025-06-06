import { Button } from '@components/common/Button';
import { Modal, ModalProps } from '@components/common/Modal';
import { Input } from '@components/common/form/Input';
import { ErrorCodes } from '@custom-types/ErrorCodes';
import { zodResolver } from '@hookform/resolvers/zod';
import { RecipeResourceMetric } from '@najit-najist/database/models';
import { recipeResourceMetricCreateInputSchema } from '@server/schemas/recipeResourceMetricCreateInputSchema';
import { TRPCClientError } from '@trpc/client';
import { trpc } from '@trpc/web';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

export const AddMetricModal: FC<
  Pick<ModalProps, 'open' | 'onClose'> & {
    onCreated?: (metric: RecipeResourceMetric) => void;
  }
> = ({ open, onClose, onCreated }) => {
  const { mutateAsync: create } = trpc.recipes.metrics.create.useMutation();
  const { register, formState, handleSubmit, setError, reset } = useForm<
    Pick<RecipeResourceMetric, 'name'>
  >({
    defaultValues: { name: '' },
    resolver: zodResolver(recipeResourceMetricCreateInputSchema),
  });

  const utils = trpc.useUtils();

  const onSubmit: Parameters<typeof handleSubmit>['0'] = async (input) => {
    try {
      const result = await create(input);
      const currentQueryData = utils.recipes.metrics.getMany.getData();
      utils.recipes.metrics.getMany.setData(
        {},
        {
          nextToken: '',
          total: 1,
          ...currentQueryData,
          items: [...(currentQueryData?.items ?? []), result],
        },
      );
      onCreated?.(result);
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
        <div className="mt-5 flex gap-4">
          <Button isLoading={formState.isSubmitting} type="submit" size="sm">
            Přidat
          </Button>
          <Button
            disabled={formState.isSubmitting}
            size="sm"
            appearance="link"
            color="red"
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
