'use client';

import { Skeleton } from '@najit-najist/ui';
import dynamic from 'next/dynamic';
import { Controller } from 'react-hook-form';

const LazyEditor = dynamic(
  () =>
    import('@najit-najist/ui/editor').then(({ QuillEditor }) => QuillEditor),
  {
    ssr: false,
    loading() {
      return <Skeleton rounded className="h-20" />;
    },
  }
);

export const DescriptionEdit = () => {
  return (
    <Controller
      name="description"
      render={({ field: { ref, ...field }, fieldState }) => (
        <LazyEditor
          rootClassName="w-full min-h-full"
          className="h-full"
          placeholder="Úvod článku..."
          error={fieldState.error}
          {...field}
        />
      )}
    />
  );
};
