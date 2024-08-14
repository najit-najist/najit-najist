'use client';

import { ProductWithRelationsLocal } from '@custom-types/index';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@najit-najist/ui';
import { useMutation } from '@tanstack/react-query';

import { deleteProductAction } from './actions/deleteProductAction';

const useDelete = () =>
  useMutation({
    mutationFn: deleteProductAction,
  });

export const DeleteButton = ({
  id,
}: Pick<ProductWithRelationsLocal, 'id' | 'slug'>) => {
  const { mutate, isLoading } = useDelete();

  return (
    <Button
      appearance="spaceless"
      color="red"
      className="ml-3 text-white h-full aspect-square"
      isLoading={isLoading}
      onClick={() => mutate({ id })}
    >
      {!isLoading ? <TrashIcon className="w-5" /> : null}
    </Button>
  );
};
