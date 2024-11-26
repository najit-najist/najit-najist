import { Alert } from '@components/common/Alert';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { ProductWithRelationsLocal } from '@custom-types';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
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
          <Link
            href="/administrace"
            className="text-red-400 hover:underline group text-sm"
          >
            <ArrowLeftIcon
              strokeWidth={3}
              className="w-4 h-4 inline-block relative group-hover:-translate-x-1 mr-1 duration-100 -mt-1"
            />
            Zpět na rozcestník
          </Link>
        </div>
      ) : null}
      <Alert heading="" color="warning" className="w-full">
        <div className="container">
          <div className="flex justify-between items-center">
            {product && (
              <EditedAt
                createdAt={product.createdAt}
                updatedAt={product.updatedAt}
              />
            )}
            <div className="ml-auto flex gap-3">
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
                  color: isEditorEnabled ? 'subtleRed' : 'normal',
                  asLink: true,
                  appearance: 'extraSmall',
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
