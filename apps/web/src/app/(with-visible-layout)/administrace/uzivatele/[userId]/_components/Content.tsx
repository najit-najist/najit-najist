'use client';

import { User } from '@najit-najist/api';
import { FC, useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { EditUserUnderPage } from '@components/page-components/EditUserUnderpage';

export const Content: FC<{ user: User }> = ({ user }) => {
  const formMethods = useForm<User>({
    defaultValues: user,
  });
  const { handleSubmit } = formMethods;
  const onSubmit: SubmitHandler<User> = useCallback(() => {}, []);

  return (
    <FormProvider {...formMethods}>
      <EditUserUnderPage
        viewType="edit"
        userId={user.id}
        onSubmit={handleSubmit(onSubmit)}
      />
    </FormProvider>
  );
};
