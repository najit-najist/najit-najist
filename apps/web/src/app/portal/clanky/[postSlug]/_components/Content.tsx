'use client';

import { Section } from '@components/portal';
import { Post } from '@najit-najist/api';
import { Button } from '@najit-najist/ui';
import { FC, useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { PostFormContent } from '../../_components/PostFormContent';

export const Content: FC<{ post: Post }> = ({ post }) => {
  const formMethods = useForm({
    defaultValues: post,
  });

  const { formState, handleSubmit } = formMethods;

  const onSubmit: SubmitHandler<Post> = useCallback(() => {}, []);

  return (
    <FormProvider {...formMethods}>
      <Section>
        <form onSubmit={handleSubmit(onSubmit)} className="px-10">
          <PostFormContent />
          <div className="pt-5 text-right">
            <Button isLoading={formState.isSubmitting}>Uložit</Button>
          </div>
        </form>
      </Section>
    </FormProvider>
  );
};
