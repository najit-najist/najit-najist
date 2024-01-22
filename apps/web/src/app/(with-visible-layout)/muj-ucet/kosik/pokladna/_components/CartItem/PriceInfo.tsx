'use client';

import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { Product, UserCartProduct } from '@najit-najist/api';
import { NumberInput, Price } from '@najit-najist/ui';
import { trpc } from '@trpc';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import {
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDebounce } from 'usehooks-ts';

export const PriceInfo: FC<{
  productId: Product['id'];
  countInCart: UserCartProduct['count'];
  productPrice: Product['price']['value'];
}> = ({ productId, productPrice, countInCart: initialCountInCart }) => {
  const { startTransition, isActive: isDoingTransition } =
    useReactTransitionContext();
  const router = useRouter();
  const utils = trpc.useUtils();

  const { mutateAsync: updateItem } =
    trpc.profile.cart.products.update.useMutation();

  const [cartItemQuantity, setCartItemQuantity] = useState(initialCountInCart);
  const debouncedItemQuantity = useDebounce(cartItemQuantity, 300);

  useEffect(() => {
    if (debouncedItemQuantity !== initialCountInCart) {
      startTransition(async () => {
        await updateItem({
          product: { id: productId },
          count: debouncedItemQuantity,
        });
        await utils.profile.cart.products.get.many.invalidate();

        router.refresh();
      });
    }
  }, [
    debouncedItemQuantity,
    updateItem,
    productId,
    initialCountInCart,
    router,
    utils,
    startTransition,
  ]);

  const handleCountChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const nextValue = Number(event.target.value);

      setCartItemQuantity(nextValue);
    },
    []
  );

  return (
    <>
      <Price
        value={productPrice * initialCountInCart}
        className={clsx('mt-auto', isDoingTransition ? 'blur-sm' : '')}
      />

      <div className="lg:ml-4">
        <NumberInput
          label="Počet"
          hideLabel
          className="max-w-[4rem]"
          step={1}
          min={1}
          max={99}
          disabled={isDoingTransition}
          value={cartItemQuantity}
          onChange={handleCountChange}
        />
      </div>
    </>
  );
};
