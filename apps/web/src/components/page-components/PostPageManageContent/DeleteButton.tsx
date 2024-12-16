'use client';

import { Button } from '@components/common/Button';
import { PostWithRelations } from '@custom-types/index';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@tanstack/react-query';

import { deletePostAction } from './actions/deletePostAction';

const useDelete = () =>
  useMutation({
    mutationFn: deletePostAction,
  });

export const DeleteButton = ({
  id,
}: Pick<PostWithRelations, 'id' | 'slug'>) => {
  const { mutate, isPending: isLoading } = useDelete();

  return (
    <Button
      color="red"
      className="text-white aspect-square block h-9 w-9 !px-0"
      isLoading={isLoading}
      onClick={() => mutate({ id })}
    >
      {!isLoading ? <TrashIcon className="w-5" /> : null}
    </Button>
  );
};
