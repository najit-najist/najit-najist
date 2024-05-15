'use client';

import { trpc } from '@client/trpc';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useUserCartQueryKey } from '@hooks/useUserCart';
import { Product } from '@najit-najist/database/models';
import { Tooltip } from '@najit-najist/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FC, useCallback } from 'react';
import { useFormState } from 'react-hook-form';

export const DeleteButton: FC<{
  productId: Product['id'];
}> = ({ productId }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const formState = useFormState();
  const { isSubmitting } = formState;
  const { startTransition, isActive: isChangingRoutes } =
    useReactTransitionContext();

  const { mutateAsync: removeItem, isLoading: isRemoving } =
    trpc.profile.cart.products.remove.useMutation();
  const disabled = isChangingRoutes || isSubmitting;

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
      disabled={disabled}
      trigger={
        <button
          type="button"
          className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-red-300 hover:text-red-500 flex-none"
          disabled={isRemoving || disabled}
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
