'use client';

import { Skeleton } from '@components/common/Skeleton';
import dynamic from 'next/dynamic';
import { Controller } from 'react-hook-form';

const LazyEditor = dynamic(
  () => import('../../../common/editor').then(({ QuillEditor }) => QuillEditor),
  {
    ssr: false,
    loading() {
      return <Skeleton rounded className="h-full min-h-60" />;
    },
  },
);

export const DescriptionEdit = () => {
  return (
    <Controller
      name="description"
      render={({ field: { ref, ...field }, fieldState }) => (
        <LazyEditor
          rootClassName="w-full min-h-full h-full"
          className="h-full"
          placeholder="Úvod článku..."
          error={fieldState.error}
          {...field}
        />
      )}
    />
  );
};
