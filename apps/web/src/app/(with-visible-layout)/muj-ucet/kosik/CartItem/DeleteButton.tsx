'use client';

import { Tooltip } from '@components/common/Tooltip';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useUserCartQueryKey } from '@hooks/useUserCart';
import { Product } from '@najit-najist/database/models';
import { useQueryClient } from '@tanstack/react-query';
import { trpc } from '@trpc/web';
import { useRouter } from 'next/navigation';
import { FC, useCallback } from 'react';

export const DeleteButton: FC<{
  productId: Product['id'];
}> = ({ productId }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { startTransition, isActive: isChangingRoutes } =
    useReactTransitionContext();

  const { mutateAsync: removeItem, isPending: isRemoving } =
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

      await queryClient.invalidateQueries({
        queryKey: useUserCartQueryKey,
      });

      router.refresh();
    });
  }, [productId, queryClient, removeItem, router, startTransition]);

  return (
    <Tooltip
      disabled={isRemoving || isChangingRoutes}
      trigger={
        <button
          type="button"
          className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-red-300 hover:text-red-500 flex-none"
          disabled={isRemoving || isChangingRoutes}
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
