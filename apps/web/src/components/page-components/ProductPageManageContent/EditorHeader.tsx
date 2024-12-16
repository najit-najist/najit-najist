import { Alert } from '@components/common/Alert';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { GoBackButton } from '@components/common/GoBackButton';
import { ProductWithRelationsLocal } from '@custom-types';
import Link from 'next/link';
import { FC } from 'react';

import { DeleteButton } from './DeleteButton';
import { EditedAt } from './EditedAt';
import { EditorButtons } from './EditorButtons';
import { ViewType } from './_types';

export const EditorHeader: FC<{
  viewType: ViewType;
  product?: ProductWithRelationsLocal;
}> = ({ viewType, product }) => {
  const isEditorEnabled = viewType === 'edit';

  return (
    <>
      {isEditorEnabled ? (
        <div className="container my-2">
          <GoBackButton
            text="Odejít z úpravy"
            href={`/produkty/${encodeURIComponent(product?.slug ?? '')}`}
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
            {product && (
              <EditedAt
                createdAt={product.createdAt}
                updatedAt={product.updatedAt}
              />
            )}
            <div className="sm:ml-auto flex gap-3">
              {isEditorEnabled || viewType === 'create' ? (
                <EditorButtons viewType={viewType} />
              ) : null}
              {viewType === 'edit' && product ? (
                <DeleteButton {...product} />
              ) : null}
            </div>
            {viewType !== 'create' && !isEditorEnabled ? (
              <Link
                href={`${isEditorEnabled ? '' : '/administrace'}/produkty/${encodeURIComponent(product?.slug ?? '')}`}
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
