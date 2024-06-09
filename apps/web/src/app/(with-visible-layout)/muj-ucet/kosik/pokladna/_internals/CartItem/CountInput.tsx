'use client';

import { trpc } from '@client/trpc';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { ProductWithRelationsLocal } from '@custom-types';
import { useUserCartQueryKey } from '@hooks/useUserCart';
import { UserCartProduct } from '@najit-najist/database/models';
import { NumberInput } from '@najit-najist/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ChangeEventHandler, FC, useCallback } from 'react';
import { useFormState } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';

export const CountInput: FC<{
  productId: ProductWithRelationsLocal['id'];
  countInCart: UserCartProduct['count'];
}> = ({ productId, countInCart: initialCountInCart }) => {
  const formState = useFormState();
  const { isSubmitting } = formState;
  const { startTransition, isActive: isChangingRoutes } =
    useReactTransitionContext();
  const disabled = isChangingRoutes || isSubmitting;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: updateItem } =
    trpc.profile.cart.products.update.useMutation();

  const syncCartStateDebounced = useDebounceCallback(
    (nextQuantity: number | string) => {
      startTransition(async () => {
        await updateItem({
          product: { id: productId },
          count: Number(nextQuantity),
        });
        await queryClient.invalidateQueries({
          queryKey: useUserCartQueryKey,
        });

        router.refresh();
      });
    },
    300
  );

  const handleCountChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const nextValue = Number(event.target.value);

      syncCartStateDebounced(nextValue);
    },
    [syncCartStateDebounced]
  );

  return (
    <NumberInput
      label="Počet"
      hideLabel
      className="max-w-[4rem]"
      step={1}
      min={1}
      max={99}
      disabled={disabled}
      defaultValue={initialCountInCart}
      onChange={handleCountChange}
    />
  );
};
