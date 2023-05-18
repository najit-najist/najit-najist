import { Section } from '@components/portal';
import { Post } from '@najit-najist/api';
import { Input, Textarea } from '@najit-najist/ui';
import type { BlockEditorCode } from '@najit-najist/ui/editor';
import { useEditorJSInstances } from '@contexts/editorJsInstancesContext';
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

export const PostFormContent: FC = () => {
  const { register, formState, watch } = useFormContext<Post>();
  const fieldsAreDisabled = formState.isSubmitting;
  const [editorInstance, setEditorInstance] = useState<BlockEditorCode>();
  const editorId = useId();
  const editorInstances = useEditorJSInstances();
  const editorData = watch('content');

  useEffect(() => {
    if (editorInstance) {
      editorInstances.set(editorId, editorInstance);
    }

    return () => {
      editorInstances.delete(editorId);
    };
  }, [editorInstance, editorId, editorInstances]);

  return (
    <>
      <Input
        size="lg"
        error={formState.errors.title}
        disabled={fieldsAreDisabled}
        rootClassName="mt-6 mb-6"
        appearance="standalone"
        placeholder="Titulek článku"
        {...register('title')}
      />

      <Textarea
        label="Rychlý úvod"
        className="!text-lg !leading-7"
        rows={6}
        wrapperClassName="mb-6"
        placeholder="Úvod článku"
        disabled={fieldsAreDisabled}
        error={formState.errors.description?.message}
        {...register('description')}
      />

      <Section className="px-[64px]">
        <LazyEditor
          defaultValue={editorData}
          onInitialize={setEditorInstance}
          minHeight={200}
        />
      </Section>
    </>
  );
};
