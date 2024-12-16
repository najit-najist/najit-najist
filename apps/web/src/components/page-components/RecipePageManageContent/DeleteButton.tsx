'use client';

import { Button } from '@components/common/Button';
import { RecipeWithRelations } from '@custom-types/index';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';

import { deleteRecipeAction } from './actions/deleteRecipeAction';

const useDelete = () =>
  useMutation({
    mutationFn: deleteRecipeAction,
  });

export const DeleteButton = ({
  id,
}: Pick<RecipeWithRelations, 'id' | 'slug'>) => {
  const { mutate, isPending: isLoading } = useDelete();

  return (
    <Button
      color="red"
      className="text-white aspect-square block h-9 w-9 !px-1"
      isLoading={isLoading}
      onClick={() => mutate({ id })}
    >
      {!isLoading ? <TrashIcon className="w-5" /> : null}
    </Button>
  );
};
