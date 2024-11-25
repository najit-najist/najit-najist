'use client';

import { Skeleton } from '@components/common/Skeleton';
import { FormControlWrapper } from '@components/common/form/FormControlWrapper';
import dynamic from 'next/dynamic';
import { Controller } from 'react-hook-form';

const LazyEditor = dynamic(
  () => import('../../../common/editor').then(({ QuillEditor }) => QuillEditor),
  {
    ssr: false,
    loading() {
      return <Skeleton rounded className="h-40" />;
    },
  },
);

export const DescriptionEdit = () => {
  return (
    <Controller
      name="description"
      render={({ field: { ref, ...field }, fieldState }) => (
        <FormControlWrapper error={fieldState.error}>
          <LazyEditor {...field} />
        </FormControlWrapper>
      )}
    />
  );
};
