'use client';

import { Button, Switch, buttonStyles } from '@najit-najist/ui';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { ViewType } from './_types';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import { trpc } from '@trpc';
import { Post } from '@najit-najist/api';
import { useController, useFormContext } from 'react-hook-form';

const Buttons: FC<{ viewType: ViewType }> = ({ viewType }) => {
  const [changePublishedAtTo, setChangePublishedAtTo] = useState<
    null | boolean
  >(viewType === 'create' ? true : null);
  const { formState } = useFormContext<Post>();
  const { field } = useController({ name: 'publishedAt' });

  const toggleChangePublishedAt = () =>
    setChangePublishedAtTo((prev) => (prev === null ? !field.value : !prev));
  const isPublishedAtToggled =
    changePublishedAtTo == null ? !!field.value : changePublishedAtTo;

  const onSaveClick = () => {
    if (changePublishedAtTo !== null) {
      const willBe = changePublishedAtTo ? new Date().toString() : null;

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
  post?: Pick<Post, 'id' | 'slug'>;
}> = ({ viewType, post }) => {
  const pathname = usePathname();
  const router = useRouter();
  const isEditorEnabled = viewType === 'edit';
  const href = `${pathname}${isEditorEnabled ? '' : '?editor=true'}`;

  const {
    mutateAsync: deleteItem,
    isLoading: isRemoving,
    isSuccess: isRemoved,
  } = trpc.posts.delete.useMutation();

  const onLinkClick = () => {
    router.refresh();
  };

  const onDeleteClick = async () => {
    if (!post) {
      throw new Error('No post provided');
    }

    if (confirm('Opravdu smazat článek?')) {
      await deleteItem(post);

      router.push('/clanky');
    }
  };

  return (
    <div className="bottom-0 left-0 fixed z-20 w-full bg-white border-t-2 border-gray-100">
      <div className="container mx-auto my-2 flex">
        {viewType === 'edit' || viewType === 'view' ? (
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
              type="submit"
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
