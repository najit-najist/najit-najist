'use client';

import { Button } from '@components/common/Button';
import { ProductWithRelationsLocal } from '@custom-types/index';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';

import { deleteProductAction } from './actions/deleteProductAction';

const useDelete = () =>
  useMutation({
    mutationFn: deleteProductAction,
  });

export const DeleteButton = ({
  id,
}: Pick<ProductWithRelationsLocal, 'id' | 'slug'>) => {
  const { mutate, isPending: isLoading } = useDelete();

  return (
    <Button
      appearance="spaceless"
      color="red"
      className="text-white aspect-square block h-9"
      isLoading={isLoading}
      onClick={() => mutate({ id })}
    >
      {!isLoading ? <TrashIcon className="w-5" /> : null}
    </Button>
  );
};
