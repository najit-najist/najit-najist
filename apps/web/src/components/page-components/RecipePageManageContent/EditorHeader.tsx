'use client';

import { trpc } from '@client/trpc';
import { TrashIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Recipe } from '@najit-najist/database/models';
import { Button, buttonStyles } from '@najit-najist/ui';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { ViewType } from './_types';

const SubmitButton: FC = () => {
  const { formState } = useFormContext();

  return (
    <>
      <Button
        className="ml-auto"
        type="submit"
        isLoading={formState.isSubmitting}
      >
        Uložit
      </Button>
    </>
  );
};

export const EditorHeader: FC<{
  viewType: ViewType;
  recipe?: Pick<Recipe, 'id' | 'slug'>;
}> = ({ viewType, recipe }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isEditorEnabled = viewType === 'edit';
  const href = `${isEditorEnabled ? '' : '/administrace'}${pathname}`;

  const {
    mutateAsync: deleteItem,
    isLoading: isRemoving,
    isSuccess: isRemoved,
  } = trpc.recipes.delete.useMutation();

  const onLinkClick = () => {
    router.refresh();
  };

  const onDeleteClick = async () => {
    if (!recipe) {
      throw new Error('No recipe provided');
    }

    if (confirm('Opravdu smazat recept?')) {
      await deleteItem(recipe);

      router.push('/recepty');
    }
  };

  return (
    <div className="bottom-0 left-0 fixed z-20 w-full bg-white border-t-2 border-gray-100">
      <div className="container mx-auto my-2 flex">
        {viewType !== 'create' ? (
          <Link
            href={href as any}
            onClick={onLinkClick}
            className={buttonStyles({
              color: isEditorEnabled ? 'subtleRed' : 'normal',
              asLink: true,
              appearance: 'small',
            })}
          >
            {isEditorEnabled ? (
              <ArrowLeftIcon className="inline w-5 -mt-1 mr-2" />
            ) : null}
            {isEditorEnabled ? 'Ukončit úpravu' : 'Upravit'}
          </Link>
        ) : null}
        <div className="ml-auto flex gap-4">
          {isEditorEnabled || viewType === 'create' ? <SubmitButton /> : null}
          {viewType === 'edit' ? (
            <Button
              appearance="spaceless"
              color="red"
              className="ml-3 text-white h-full aspect-square"
              isLoading={isRemoving || isRemoved}
              onClick={onDeleteClick}
            >
              {!(isRemoving || isRemoved) ? (
                <TrashIcon className="w-5" />
              ) : null}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
