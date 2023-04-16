'use client';

import { Section } from '@components/portal';
import { User } from '@najit-najist/api';
import { Button } from '@najit-najist/ui';
import { FC, useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { UsersFormContent } from '../../_components/UsersFormContent';

export const Content: FC<{ user: User }> = ({ user }) => {
  const formMethods = useForm({
    defaultValues: user,
  });

  const { formState, handleSubmit } = formMethods;

  const onSubmit: SubmitHandler<User> = useCallback(() => {}, []);

  return (
    <FormProvider {...formMethods}>
      <Section>
        <div className="px-10">
          <h1 className="text-2xl">
            Uživatel: {user.firstName} {user.lastName}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-10">
          <UsersFormContent />
          <div className="pt-5 text-right">
            <Button isLoading={formState.isSubmitting}>Uložit</Button>
          </div>
        </form>
      </Section>
    </FormProvider>
  );
};
