'use client';

import { dayjs } from '@dayjs';
import { Button, Switch } from '@najit-najist/ui';
import { FC, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';

import { ProductFormData, ViewType } from './_types';

export const EditorButtons: FC<{ viewType: ViewType }> = ({ viewType }) => {
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
      const willBe = changePublishedAtTo ? dayjs.tz().toDate() : null;

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
