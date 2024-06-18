'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Recipe } from '@najit-najist/database/models';
import { Button, buttonStyles } from '@najit-najist/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useTransition } from 'react';
import { useFormContext } from 'react-hook-form';

import { ViewType } from './_types';
import { deleteRecipeAction } from './actions/deleteRecipeAction';

const SubmitButton: FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { formState } = useFormContext();

  return (
    <>
      <Button
        className="ml-auto"
        type="submit"
        isLoading={formState.isSubmitting}
        disabled={disabled}
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
  const isEditorEnabled = viewType === 'edit';
  const href = `${isEditorEnabled ? '' : '/administrace'}${pathname}`;
  const [isDeleting, startDeleting] = useTransition();

  const onDeleteClick = async () => {
    if (!recipe) {
      throw new Error('No recipe provided');
    }

    if (confirm('Opravdu smazat recept?')) {
      startDeleting(async () => {
        await deleteRecipeAction(recipe);
      });
    }
  };

  return (
    <div className="bottom-0 left-0 fixed z-20 w-full bg-white border-t-2 border-gray-100">
      <div className="container mx-auto my-2 flex">
        {viewType !== 'create' ? (
          <Link
            href={href}
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
          {isEditorEnabled || viewType === 'create' ? (
            <SubmitButton disabled={isDeleting} />
          ) : null}
          {viewType === 'edit' ? (
            <Button
              appearance="spaceless"
              color="red"
              className="ml-3 text-white h-full aspect-square"
              isLoading={isDeleting}
              onClick={onDeleteClick}
            >
              {!isDeleting ? <TrashIcon className="w-5" /> : null}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
