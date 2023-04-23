import { Section } from '@components/portal';
import { Post } from '@najit-najist/api';
import { Input, Textarea } from '@najit-najist/ui';
import { EditorCode } from '@najit-najist/ui/editor';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

const LazyEditor = dynamic(
  () => import('@najit-najist/ui/editor').then(({ Editor }) => Editor),
  {
    ssr: false,
    loading() {
      return <div className="h-96"></div>;
    },
  }
);

type PostFormContentProps = { onEditorInit?: (core: EditorCode) => void };

export const PostFormContent: FC<PostFormContentProps> = ({ onEditorInit }) => {
  const { register, formState, watch } = useFormContext<Post>();
  const fieldsAreDisabled = formState.isSubmitting;

  const editorData = watch('content');

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
          onInitialize={onEditorInit}
          minHeight={200}
        />
      </Section>
    </>
  );
};
