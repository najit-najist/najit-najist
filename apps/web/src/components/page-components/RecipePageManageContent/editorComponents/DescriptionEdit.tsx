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
      return <Skeleton rounded className="h-40" />;
    },
  }
);

export const DescriptionEdit = () => {
  return (
    <Controller
      name="description"
      render={({ field: { ref, ...field } }) => <LazyEditor {...field} />}
    />
  );
};
