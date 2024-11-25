'use client';

import { Skeleton } from '@components/common/Skeleton';
import { FormControlWrapper } from '@components/common/form/FormControlWrapper';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { Controller } from 'react-hook-form';

const LazyEditor = dynamic(
  () => import('../../../common/editor').then(({ QuillEditor }) => QuillEditor),
  {
    ssr: false,
    loading() {
      return <Skeleton rounded className="h-50" />;
    },
  },
);

export const ContentEdit: FC = () => {
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
