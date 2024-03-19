'use client';

import { FormControlWrapper, Skeleton } from '@najit-najist/ui';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { Controller, useWatch } from 'react-hook-form';

const LazyEditor = dynamic(
  () =>
    import('@najit-najist/ui/editor').then(({ QuillEditor }) => QuillEditor),
  {
    ssr: false,
    loading() {
      return <Skeleton rounded className="h-50" />;
    },
  }
);

export const ContentEdit: FC = () => {
  console.log(useWatch({ name: 'content' }));

  return (
    <Controller
      name="content"
      render={({ field: { ref, ...field }, fieldState }) => (
        <FormControlWrapper title="Obsah" error={fieldState.error}>
          <LazyEditor placeholder="Obsah článku" {...field} />
        </FormControlWrapper>
      )}
    />
  );
};
