'use client';

import { ProductWithRelationsLocal } from '@custom-types';
import { TrashIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Button, Switch, buttonStyles } from '@najit-najist/ui';
import { trpc } from '@trpc';
import clsx from 'clsx';
import dayjs from 'dayjs';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { ProductFormData, ViewType } from './_types';

const Buttons: FC<{ viewType: ViewType }> = ({ viewType }) => {
  const [changePublishedAtTo, setChangePublishedAtTo] = useState<
    null | boolean
  >(viewType === 'create' ? true : null);
  const { formState } = useFormContext<ProductFormData>();
  const { field } = useController({ name: 'publishedAt' });

  const toggleChangePublishedAt = () =>
    setChangePublishedAtTo((prev) => (prev === null ? !field.value : !prev));
  const isPublishedAtToggled =
    changePublishedAtTo == null ? !!field.value : changePublishedAtTo;

  const onSaveClick = () => {
    if (changePublishedAtTo !== null) {
      const willBe = changePublishedAtTo ? dayjs().toDate() : null;

      field.onChange(willBe);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <span>Publikováno?</span>
        <Switch
          disabled={formState.isSubmitting}
          value={isPublishedAtToggled}
          onChange={toggleChangePublishedAt}
          description="Publikovat"
        />
      </div>

      <Button
        className="ml-auto"
        type="submit"
        isLoading={formState.isSubmitting}
        onClick={onSaveClick}
      >
        Uložit
      </Button>
    </>
  );
};

export const EditorHeader: FC<{
  viewType: ViewType;
  product?: Pick<ProductWithRelationsLocal, 'id' | 'slug'>;
}> = ({ viewType, product }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isEditorEnabled = viewType === 'edit';
  const href = `${pathname}${isEditorEnabled ? '' : '?editor=true'}`;

  const {
    mutateAsync: deleteItem,
    isLoading: isRemoving,
    isSuccess: isRemoved,
  } = trpc.products.delete.useMutation();

  const onLinkClick = () => {
    router.refresh();
  };

  const onDeleteClick = async () => {
    if (!product) {
      throw new Error('No product provided');
    }

    if (confirm('Opravdu smazat produkt?')) {
      await deleteItem(product);

      router.push('/produkty');
    }
  };

  return (
    <div
      className={clsx(
        'bottom-0 left-0 fixed z-20 w-full bg-white border-t-2 border-gray-100'
      )}
    >
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
          {isEditorEnabled || viewType === 'create' ? (
            <Buttons viewType={viewType} />
          ) : null}
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
