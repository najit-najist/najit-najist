import { DEFAULT_DATE_FORMAT } from '@constants';
import { ProductWithRelationsLocal } from '@custom-types';
import { dayjs } from '@dayjs';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { buttonStyles } from '@najit-najist/ui';
import clsx from 'clsx';
import Link from 'next/link';
import { FC } from 'react';

import { DeleteButton } from './DeleteButton';
import { EditorButtons } from './EditorButtons';
import { ViewType } from './_types';

export const EditorHeader: FC<{
  viewType: ViewType;
  product?: ProductWithRelationsLocal;
}> = ({ viewType, product }) => {
  const isEditorEnabled = viewType === 'edit';

  return (
    <div
      className={clsx(
        'bottom-0 left-0 fixed z-20 w-full bg-white border-t-2 border-gray-100',
      )}
    >
      <div className="container mx-auto my-2 flex">
        {viewType !== 'create' && product ? (
          <div className="mr-auto flex items-center justify-center">
            <Link
              href={`${isEditorEnabled ? '' : '/administrace'}/produkty/${encodeURIComponent(product?.slug ?? '')}`}
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
            <div className="ml-5 text-gray-500 tet-sm flex flex-col">
              {product.updatedAt ? (
                <>Upraveno: {dayjs(product.updatedAt).fromNow()}</>
              ) : (
                <>
                  Vytvořeno:{' '}
                  {dayjs(product.createdAt).format(DEFAULT_DATE_FORMAT)}
                </>
              )}
            </div>
          </div>
        ) : null}
        <div className="ml-auto flex gap-4">
          {isEditorEnabled || viewType === 'create' ? (
            <EditorButtons viewType={viewType} />
          ) : null}
          {viewType === 'edit' && product ? (
            <DeleteButton {...product} />
          ) : null}
        </div>
      </div>
    </div>
  );
};
