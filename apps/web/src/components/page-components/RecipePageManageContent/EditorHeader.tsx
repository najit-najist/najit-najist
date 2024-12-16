import { Alert } from '@components/common/Alert';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { GoBackButton } from '@components/common/GoBackButton';
import { Recipe } from '@najit-najist/database/models';
import Link from 'next/link';
import { FC } from 'react';

import { EditedAt } from '../ProductPageManageContent/EditedAt';
import { DeleteButton } from './DeleteButton';
import { EditorButtons } from './EditorButtons';
import { ViewType } from './_types';

export const EditorHeader: FC<{
  viewType: ViewType;
  recipe?: Pick<Recipe, 'id' | 'slug' | 'createdAt' | 'updatedAt'>;
}> = ({ viewType, recipe }) => {
  const isEditorEnabled = viewType === 'edit';

  return (
    <>
      {isEditorEnabled ? (
        <div className="container my-2">
          <GoBackButton
            text="Odejít z úpravy"
            href={`/recepty/${encodeURIComponent(recipe?.slug ?? '')}`}
          />
        </div>
      ) : null}
      <Alert
        heading=""
        rounded={false}
        color="warning"
        className="w-full block sm:sticky top-0 left-0 z-20"
      >
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            {recipe && (
              <EditedAt
                createdAt={recipe.createdAt}
                updatedAt={recipe.updatedAt}
              />
            )}
            <div className="sm:ml-auto flex gap-3">
              {isEditorEnabled || viewType === 'create' ? (
                <EditorButtons viewType={viewType} />
              ) : null}
              {viewType === 'edit' && recipe ? (
                <DeleteButton {...recipe} />
              ) : null}
            </div>
            {viewType !== 'create' && !isEditorEnabled ? (
              <Link
                href={`${isEditorEnabled ? '' : '/administrace'}/recepty/${encodeURIComponent(recipe?.slug ?? '')}`}
                className={buttonStyles({
                  color: isEditorEnabled ? 'red' : 'primary',
                  size: 'sm',
                })}
              >
                {isEditorEnabled ? 'Ukončit úpravu' : 'Upravit'}
              </Link>
            ) : null}
          </div>
        </div>
      </Alert>
    </>
  );
};
