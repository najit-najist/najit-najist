'use client';

import { Alert } from '@components/common/Alert';
import { Button } from '@components/common/Button';
import { buttonStyles } from '@components/common/Button/buttonStyles';
import { GoBackButton } from '@components/common/GoBackButton';
import { Switch } from '@components/common/form/Switch';
import { PostWithRelations } from '@custom-types';
import Link from 'next/link';
import { FC, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { EditedAt } from '../ProductPageManageContent/EditedAt';
import { DeleteButton } from './DeleteButton';
import { ViewType } from './_types';

const Buttons: FC<{ viewType: ViewType }> = ({ viewType }) => {
  const [changePublishedAtTo, setChangePublishedAtTo] = useState<
    null | boolean
  >(viewType === 'create' ? true : null);
  const { formState } = useFormContext<PostWithRelations>();
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
      {viewType !== 'create' ? (
        <div className="flex items-center gap-2">
          <span>Publikováno?</span>
          <Switch
            disabled={formState.isSubmitting}
            value={isPublishedAtToggled}
            onChange={toggleChangePublishedAt}
            description="Publikovat"
          />
        </div>
      ) : null}
      <Button
        className="ml-auto sm:w-32"
        type="submit"
        size="sm"
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
  post?: Pick<PostWithRelations, 'id' | 'slug' | 'createdAt' | 'updatedAt'>;
}> = ({ viewType, post }) => {
  const isEditorEnabled = viewType === 'edit' || viewType === 'create';

  return (
    <>
      {isEditorEnabled ? (
        <div className="container my-2">
          <GoBackButton
            text="Odejít z úpravy"
            href={`/clanky/${encodeURIComponent(post?.slug ?? '')}`}
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
            {post && (
              <EditedAt createdAt={post.createdAt} updatedAt={post.updatedAt} />
            )}
            <div className="sm:ml-auto flex gap-3">
              {isEditorEnabled ? <Buttons viewType={viewType} /> : null}
              {viewType === 'edit' && post ? <DeleteButton {...post} /> : null}
            </div>
            {viewType !== 'create' && !isEditorEnabled ? (
              <Link
                href={`${isEditorEnabled ? '' : '/administrace'}/clanky/${encodeURIComponent(post?.slug ?? '')}`}
                className={buttonStyles({
                  size: 'sm',
                })}
              >
                Upravit
              </Link>
            ) : null}
          </div>
        </div>
      </Alert>
    </>
  );
};
