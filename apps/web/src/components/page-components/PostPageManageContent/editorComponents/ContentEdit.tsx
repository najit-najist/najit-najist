'use client';

import { Post } from '@najit-najist/api';
import { BlockEditorCode } from '@najit-najist/ui/editor';
import { useEditorJSInstances } from 'contexts/editorJsInstancesContext';
import dynamic from 'next/dynamic';
import { FC, useEffect, useId, useState } from 'react';
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
  const { formState, watch } = useFormContext<Post>();
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
      defaultValue={editorData}
      onInitialize={setInstance}
      readOnly={fieldsAreDisabled}
      minHeight={200}
    />
  );
};
