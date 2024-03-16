'use client';

import { PostWithRelations } from '@custom-types';
import { BlockEditorCode } from '@najit-najist/ui/editor';
import { useEditorJSInstances } from 'contexts/editorJsInstancesContext';
import dynamic from 'next/dynamic';
import { FC, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const LazyEditor = dynamic(
  () =>
    import('@najit-najist/ui/editor').then(({ BlockEditor }) => BlockEditor),
  {
    ssr: false,
    loading() {
      return <div className="h-96"></div>;
    },
  }
);

export const ContentEdit: FC = () => {
  const { formState, watch } = useFormContext<PostWithRelations>();
  const [instance, setInstance] = useState<BlockEditorCode>();
  const editorInstances = useEditorJSInstances();
  const fieldsAreDisabled = formState.isSubmitting;

  const editorData = watch('content');

  useEffect(() => {
    if (instance) {
      editorInstances.set('content', instance);
    }

    return () => {
      editorInstances.delete('content');
    };
  }, [instance, editorInstances]);

  return (
    <LazyEditor
      defaultValue={editorData ? JSON.parse(editorData) : undefined}
      onInitialize={setInstance}
      readOnly={fieldsAreDisabled}
      minHeight={200}
      error={formState.errors.content?.message}
    />
  );
};
