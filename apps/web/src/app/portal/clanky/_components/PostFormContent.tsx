import { Post } from '@najit-najist/api';
import { Input, Editor } from '@najit-najist/ui';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

export const PostFormContent: FC = () => {
  const { register, formState, watch } = useFormContext<Post>();
  const { errors } = formState;

  const fieldsAreDisabled = formState.isSubmitting;

  const editorData = watch('content');

  return (
    <div>
      <h1 className="text-md font-semibold uppercase">Vytvoření článku:</h1>

      <Input
        size="lg"
        error={formState.errors.title}
        disabled={fieldsAreDisabled}
        className="mt-4"
        {...register('title')}
      />

      <div className="grid gap-4 mt-5">
        <Editor defaultValue={{ blocks: [] }} minHeight={500} />
      </div>
    </div>
  );
};
