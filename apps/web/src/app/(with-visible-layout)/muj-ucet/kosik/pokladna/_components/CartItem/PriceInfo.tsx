'use client';

import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { ProductWithRelationsLocal } from '@custom-types';
import { UserCartProduct } from '@najit-najist/database/models';
import { NumberInput, Price } from '@najit-najist/ui';
import { trpc } from '@trpc';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { ChangeEventHandler, FC, useCallback } from 'react';
import { useFormState } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';

export const PriceInfo: FC<{
  productId: ProductWithRelationsLocal['id'];
  countInCart: UserCartProduct['count'];
  productPrice: NonNullable<ProductWithRelationsLocal['price']>['value'];
}> = ({ productId, productPrice, countInCart: initialCountInCart }) => {
  const formState = useFormState();
  const { isSubmitting } = formState;
  const { startTransition, isActive: isChangingRoutes } =
    useReactTransitionContext();
  const disabled = isChangingRoutes || isSubmitting;
  const router = useRouter();
  const utils = trpc.useUtils();

  const { mutateAsync: updateItem } =
    trpc.profile.cart.products.update.useMutation();

  const syncCartStateDebounced = useDebounceCallback(
    (nextQuantity: number | string) => {
      startTransition(async () => {
        await updateItem({
          product: { id: productId },
          count: Number(nextQuantity),
        });
        await utils.profile.cart.products.get.many.invalidate();

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
    <>
      <Price
        value={productPrice * initialCountInCart}
        className={clsx('mt-auto', disabled ? 'blur-sm' : '')}
      />

      <div className="lg:ml-4">
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
      </div>
    </>
  );
};
