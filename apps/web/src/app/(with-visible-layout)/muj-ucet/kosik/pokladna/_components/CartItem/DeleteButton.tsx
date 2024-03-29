'use client';

import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Product } from '@najit-najist/api';
import { Tooltip } from '@najit-najist/ui';
import { trpc } from '@trpc';
import { useRouter } from 'next/navigation';
import { FC, useCallback } from 'react';

export const DeleteButton: FC<{ productId: Product['id'] }> = ({
  productId,
}) => {
  const utils = trpc.useUtils();
  const router = useRouter();
  const { startTransition, isActive: isDoingTransition } =
    useReactTransitionContext();

  const { mutateAsync: removeItem, isLoading: isRemoving } =
    trpc.profile.cart.products.remove.useMutation();

  // todo revalidate items after morph
  const handleItemDelete = useCallback(async () => {
    if (!confirm('Opravdu vymazat z košíku?')) {
      return;
    }

    startTransition(async () => {
      await removeItem({
        product: {
          id: productId,
        },
      });

      await utils.profile.cart.products.get.many.invalidate();

      router.refresh();
    });
  }, [productId, removeItem, router, startTransition, utils]);

  return (
    <Tooltip
      trigger={
        <button
          type="button"
          className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-red-300 hover:text-red-500 flex-none"
          disabled={isRemoving || isDoingTransition}
          onClick={handleItemDelete}
        >
          <span className="sr-only">Odstranit</span>
          <TrashIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      }
    >
      Odebrat z košíku
    </Tooltip>
  );
};
