'use client';

import { NumberInput } from '@components/common/form/NumberInput';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { ProductWithRelationsLocal } from '@custom-types';
import { useUserCartQueryKey } from '@hooks/useUserCart';
import { UserCartProduct } from '@najit-najist/database/models';
import { useQueryClient } from '@tanstack/react-query';
import { trpc } from '@trpc/web';
import { useRouter } from 'next/navigation';
import { ChangeEventHandler, FC, useCallback } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

export const CountInput: FC<{
  productId: ProductWithRelationsLocal['id'];
  countInCart: UserCartProduct['count'];
}> = ({ productId, countInCart: initialCountInCart }) => {
  const { startTransition, isActive: isSyncingServerState } =
    useReactTransitionContext();
  const disabled = isSyncingServerState;
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
    300,
  );

  const handleCountChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const nextValue = Number(event.target.value);

      syncCartStateDebounced(nextValue);
    },
    [syncCartStateDebounced],
  );

  return (
    <NumberInput
      hideLabel
      label="Počet"
      className="!w-[5rem] text-center"
      step={1}
      min={1}
      max={99}
      disabled={disabled}
      defaultValue={initialCountInCart}
      onChange={handleCountChange}
    />
  );
};
